const router = require('express').Router()
const { authenticateUser } = require('../auth/middleware')
const {createCommentController, getAllCommentsController} = require('../controller/comments.controller')

router
.route('/:id').get(authenticateUser, getAllCommentsController)

router
.route('/').post(authenticateUser, createCommentController)

//delete, edit and others can come later
//shouldn't be too hard can just fully replace the comment part

module.exports = router