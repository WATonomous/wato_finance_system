const router = require('express').Router()
const CommentController = require('../controllers/comment.controller')

router.route('/').post(CommentController.createComment)
router
    .route('/:ticketType/:ticketId')
    .get(CommentController.getAllCommentsForTicket)

module.exports = router
