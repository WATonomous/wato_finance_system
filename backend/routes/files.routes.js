const router = require('express').Router()
const FilesController = require('../controller/files.controller')
const { authenticateUser } = require('../auth/middleware')
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
router.get('/:id', authenticateUser, FilesController.getFileController)
router.get(
    '/getallbyreference/:reference',
    authenticateUser,
    FilesController.getAllFilesByReferenceController
)
router.post(
    '/',
    authenticateUser,
    upload.single('file'),
    FilesController.createFileController
)
router.post(
    '/bulk/:reference',
    authenticateUser,
    upload.array('files'),
    FilesController.bulkCreateFileController
)
router.delete('/:id', authenticateUser, FilesController.deleteFileController)
router.delete(
    '/bulk',
    authenticateUser,
    FilesController.bulkDeleteFileController
)

module.exports = router
