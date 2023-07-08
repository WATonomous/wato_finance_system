const {
    getFile,
    getAllFilesByReference,
    createFile,
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

const getAllFilesByReferenceController = (req, res) => {
    getAllFilesByReference(req.params.reference)
        .then((files) => {
            res.status(200).json(files)
        })
        .catch((err) => res.status(500).json('Error: ' + err))
}

const createFileController = (req, res) => {
    createFile(req.body.file, req.body.reference)
        .then((newFile) => res.status(200).json(newFile))
        .catch((err) => res.status(500).json('Error: ' + err))
}

const deleteFileController = (req, res) => {
    deleteFile(req.params.id)
        .then((deletedFile) => res.status(200).json(deletedFile))
        .catch((err) => res.status(500).json('Error: ' + err))
}
const upload = multer({ dest: 'uploads/' })

const bulkCreateFileController = (req, res) => {
    console.log('hello here')
    console.log(req.body)
    console.log(req.params.reference)
    bulkCreateFiles(req.body.files, req.body.referenceItem)
        .then((newFiles) => res.status(200).json(newFiles))
        .catch((err) => res.status(500).json('Error: ' + err))
}

const bulkDeleteFileController = (req, res) => {
    const { ids } = req.body
    const promises = ids.map((id) => deleteFile(id))
    Promise.all(promises)
        .then((deletedFiles) => res.status(200).json(deletedFiles))
        .catch((err) => res.status(500).json('Error: ' + err))
}

module.exports = {
    getFileController,
    getAllFilesByReferenceController,
    createFileController,
    deleteFileController,
    bulkCreateFileController,
    bulkDeleteFileController,
}
