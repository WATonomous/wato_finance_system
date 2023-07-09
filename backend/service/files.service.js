const File = require('../models/files.model')

const getFile = async (id) => {
    return File.findById(id)
}

const getAllFilesByReference = async (reference) => {
    return File.find({ referenceItem: reference })
}

const createFile = (file, referenceItem, isPoDocument) => {
    const newFile = new File({
        referenceItem: referenceItem,
        filename: file.originalname,
        mimetype: file.mimetype,
        data: file.buffer,
        isPoDocument: isPoDocument,
    })
    return newFile.save()
}

const bulkCreateFiles = (files, referenceItem) => {
    const promises = files.map((file) =>
        // TODO: support isPoDocument
        createFile(file, referenceItem, false)
    )
    return Promise.all(promises)
}

const deleteFile = (id) => {
    return File.findByIdAndDelete(id)
}

module.exports = {
    getFile,
    getAllFilesByReference,
    createFile,
    bulkCreateFiles,
    deleteFile,
}
