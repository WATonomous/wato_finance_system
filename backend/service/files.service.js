const File = require('../models/file.model')
const {
    getS3FileKey,
    deleteS3File,
    generatePresignedUrl,
} = require('../aws/s3')
const { getAllChildren } = require('./sponsorshipfunds.service')

const getFile = async (id) => {
    return File.findById(id)
}

const getAllFilesByReference = async (reference) => {
    console.log(reference)
    const files = await File.find({ reference_code: reference })
    return Promise.all(
        files.map(async (file) => {
            // generate a presigned url for each file
            const presignedUrl = await generatePresignedUrl(
                process.env.AWS_FINANCE_BUCKET_NAME,
                getS3FileKey(file.reference_code, file.name)
            )
            return {
                ...file.toObject(),
                link: presignedUrl,
            }
        })
    )
}

// extract the child pprs and uprs from the sf
const flattenFundingItems = (children) => {
    // console.log(children)
    return children.fundingItems
        .map((child) => {
            return [child.personalPurchases, child.uwFinancePurchases]
        })
        .flat(2)
}
const getAllFilesBySF = async (sfCode) => {
    const children = await getAllChildren(sfCode)
    const items = flattenFundingItems(children)
    const attachmentsByKey = {}
    await Promise.all(
        items.map(async (item) => {
            const attachments = await getAllFilesByReference(item.code)
            attachmentsByKey[item.code] = attachments
        })
    )
    return attachmentsByKey
}

const createFile = async (file, referenceCode, isSupportingDocument) => {
    const newFile = new File({
        reference_code: referenceCode,
        name: file.originalname,
        location: file.location,
        mimetype: file.mimetype,
        is_supporting_document: isSupportingDocument,
    })
    return newFile.save()
}

const bulkCreateFiles = (files, referenceCode, isSupportingDocument) => {
    const promises = files.map((file) =>
        createFile(file, referenceCode, isSupportingDocument)
    )
    return Promise.all(promises)
}

const deleteFile = async (referenceCode, fileName) => {
    // first delete from s3 first, as its ok to have orphaned files in mongo (no cost) since we only store metadata
    // then delete from db
    await deleteS3File(
        process.env.AWS_FINANCE_BUCKET_NAME,
        getS3FileKey(referenceCode, fileName)
    )
    return File.findOneAndDelete({
        reference_code: referenceCode,
        name: fileName,
    })
}

module.exports = {
    getFile,
    getAllFilesByReference,
    getAllFilesBySF,
    createFile,
    bulkCreateFiles,
    deleteFile,
}
