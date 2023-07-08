const File = require('../models/files.model')

const getFile = async (id) => {
    return File.findById(id)
}

const getAllFilesByReference = async (reference) => {
    try {
        const test = await File.find({ referenceItem: reference })

        console.log(test)
    } catch (e) {
        console.log(e)
    }
    return File.find({ referenceItem: reference })
}

const createFile = (file, referenceItem) => {
    console.log('file is ')
    console.log(file)
    const newFile = new File({
        referenceItem: referenceItem,
        filename: file.filename,
        data: new Buffer.from(file, 'base64'),
        isPoDocument: body?.isPoDocument || false,
    })
    let blah = null
    try {
        const blah = newFile.save()
        console.log(blah)
    } catch (e) {
        console.log(e)
    }
    return blah
}

const bulkCreateFiles = (files, referenceItem) => {
    const promises = files.map((file) => createFile(file, referenceItem))
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
