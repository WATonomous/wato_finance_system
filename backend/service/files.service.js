const File = require('../models/file.model')
const { getS3FileKey, deleteS3File } = require('../aws/s3')

const getFile = async (id) => {
    return File.findById(id)
}

const getAllFilesByReference = async (reference) => {
    return File.find({ referenceItem: reference })
}

const createFile = async (file, referenceCode, isSupportingDocument) => {
    const newFile = new File({
        referenceCode: referenceCode,
        filename: file.originalname,
        location: file.location,
        mimetype: file.mimetype,
        isSupportingDocument: isSupportingDocument,
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
        referenceCode: referenceCode,
        filename: fileName,
    })
}

module.exports = {
    getFile,
    getAllFilesByReference,
    createFile,
    bulkCreateFiles,
    deleteFile,
}
