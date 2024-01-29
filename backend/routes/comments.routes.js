const router = require('express').Router()
const { authenticateUser } = require('../auth/middleware')
const {
    createCommentController,
    getAllCommentsController,
} = require('../controller/comments.controller')

router.route('/:id').get(authenticateUser, getAllCommentsController)

router.route('/').post(authenticateUser, createCommentController)

//TODO: delete & edit

module.exports = router
