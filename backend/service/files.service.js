const File = require('../models/file.model')
const { getS3FileKey, deleteS3File } = require('../aws/s3')

const getFile = async (id) => {
    return File.findById(id)
}

const getAllFilesByReference = async (reference) => {
    return File.find({ reference_code: reference })
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

const bulkCreateFiles = (files, referenceCode) => {
    const promises = files.map((file) =>
        // TODO: support isPoDocument
        createFile(file, referenceCode, false)
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
    createFile,
    bulkCreateFiles,
    deleteFile,
}
