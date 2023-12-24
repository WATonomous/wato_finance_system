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

// returns list of ticket codes from output of getAllChildren
const extractAllTicketCodes = (sf) => {
    const output = [sf.code]
    for (const fi of sf.fundingItems) {
        output.push(fi.code)
        for (const ppr of fi.personalPurchases) {
            output.push(ppr.code)
        }
        for (const upr of fi.uwFinancePurchases) {
            output.push(upr.code)
        }
    }
    return output
}

// returns map of ticket code to each ticket's list of files for all tickets associated with sf_id
const getAllFilesBySF = async (sf_id) => {
    const sf = await getAllChildren(sf_id)
    const ticketCodes = extractAllTicketCodes(sf)
    const attachmentsByKey = {}
    await Promise.all(
        ticketCodes.map(async (code) => {
            const attachments = await getAllFilesByReference(code)
            attachmentsByKey[code] = attachments
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
