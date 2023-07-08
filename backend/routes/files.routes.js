const router = require('express').Router()
const FilesController = require('../controller/files.controller')
const { authenticateUser } = require('../auth/middleware')

router.get('/:id', authenticateUser, FilesController.getFileController)
router.get(
    '/getallbyreference/:reference',
    authenticateUser,
    FilesController.getAllFilesByReferenceController
)
router.post('/', authenticateUser, FilesController.createFileController)
router.post(
    '/bulk:reference',
    authenticateUser,
    FilesController.bulkCreateFileController
)
router.delete(
    '/bulk',
    authenticateUser,
    FilesController.bulkDeleteFileController
)
router.delete('/:id', authenticateUser, FilesController.deleteFileController)

module.exports = router
