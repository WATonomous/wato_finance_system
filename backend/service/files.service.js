const File = require('../models/files.model')

const getFile = async (id) => {
    return File.findById(id)
}

const getAllFilesByReference = async (reference) => {
    return File.find({ referenceItem: reference })
}

const createFile = async (body) => {
    const newFile = new File(body)
    return newFile.save()
}

const deleteFile = async (id) => {
    return File.findByIdAndDelete(id)
}

module.exports = {
    getFile,
    getAllFilesByReference,
    createFile,
    deleteFile,
}
