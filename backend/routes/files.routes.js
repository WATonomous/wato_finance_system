const router = require('express').Router()
const FilesController = require('../controller/files.controller')
const { authenticateUser } = require('../auth/middleware')
const multer = require('multer')
const multerS3 = require('multer-s3')
const { s3Client, getS3FileKey } = require('../aws/s3')
const upload = multer({
    storage: multerS3({
        s3: s3Client,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        bucket: process.env.AWS_FINANCE_BUCKET_NAME,
        storageClass: 'STANDARD_IA',
        metadata: function (req, file, cb) {
            cb(null, {
                originalName: file.originalname,
                referenceCode: req?.params?.reference_code,
                mimetype: file.mimetype,
            })
        },
        key: function (req, file, cb) {
            if (!req?.params?.reference_code) {
                cb(new Error('reference_code is required'))
            }
            cb(null, getS3FileKey(req.params.reference_code, file.originalname))
        },
    }),
})

router.get('/:id', authenticateUser, FilesController.getFileController)
router.get(
    '/getallbyreference/:reference_code',
    authenticateUser,
    FilesController.getAllFilesByReferenceController
)
router.get(
    '/getallbysf/:sf_id',
    authenticateUser,
    FilesController.getAllFilesBySFId
)
router.post(
    '/bulk/:reference_code',
    authenticateUser,
    upload.array('files'),
    FilesController.bulkCreateFileController
)
router.delete(
    '/:reference_code/:filename',
    authenticateUser,
    FilesController.deleteFileController
)

module.exports = router
