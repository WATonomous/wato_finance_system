const router = require('express').Router()
const CommentController = require('../controllers/comment.controller')

router.route('/').post(CommentController.createComment)
router
    .route('/:ticketType/:ticketId')
    .get(CommentController.getAllCommentsForTicket)

//consider changing to an id we make ourselves and use /:ticketType/:ticketId/:commentId
router.route('/:id').delete(CommentController.deleteCommentById)
router.route('/newid').get(CommentController.createNewCommentId)

module.exports = router
