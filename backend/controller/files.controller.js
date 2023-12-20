const {
    getFile,
    getAllFilesByReference,
    getAllFilesBySF,
    bulkCreateFiles,
    deleteFile,
} = require('../service/files.service')

const getFileController = (req, res) => {
    getFile(req.params.id)
        .then((file) => {
            res.status(200).json(file)
        })
        .catch((err) => res.status(500).json('Error: ' + err))
}

const deleteFileController = (req, res) => {
    deleteFile(req.params.reference_code, req.params.filename)
        .then((file) => {
            res.status(200).json(file)
        })
        .catch((err) => res.status(500).json('Error: ' + err))
}

const getAllFilesByReferenceController = (req, res) => {
    getAllFilesByReference(req.params.reference_code)
        .then((files) => {
            res.status(200).json(files)
        })
        .catch((err) => res.status(500).json('Error: ' + err))
}

const getAllFilesBySFId = (req, res) => {
    getAllFilesBySF(Number(req.params.sf_id))
        .then((files) => {
            res.status(200).json(files)
        })
        .catch((err) => res.status(500).json('Error: ' + err))
}

const bulkCreateFileController = (req, res) => {
    bulkCreateFiles(
        req.files,
        req.params.reference_code,
        req.query.isSupportingDocument
    )
        .then((newFiles) => res.status(200).json(newFiles))
        .catch((err) => res.status(500).json('Error: ' + err))
}

module.exports = {
    getFileController,
    getAllFilesByReferenceController,
    getAllFilesBySFId,
    bulkCreateFileController,
    deleteFileController,
}
