const {
    getFile,
    getAllFilesByReference,
    createFile,
    deleteFile,
} = require('../service/files.service')

const getFileController = (req, res) => {
    getFile(req.params.id)
        .then((file) => {
            res.status(200).json(file)
        })
        .catch((err) => res.status(500).json('Error: ' + err))
}

const getAllFilesByReferenceController = (req, res) => {
    getAllFilesByReference(req.params.reference)
        .then((files) => {
            res.status(200).json(files)
        })
        .catch((err) => res.status(500).json('Error: ' + err))
}

const createFileController = (req, res) => {
    createFile(req.body)
        .then((newFile) => res.status(200).json(newFile))
        .catch((err) => res.status(500).json('Error: ' + err))
}

const deleteFileController = (req, res) => {
    deleteFile(req.params.id)
        .then((deletedFile) => res.status(200).json(deletedFile))
        .catch((err) => res.status(500).json('Error: ' + err))
}
