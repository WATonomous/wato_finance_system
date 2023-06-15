const router = require('express').Router()
const UsersController = require('../controller/users.controller')
const { authenticateUser } = require('../auth/middleware')

router.route('/').get(authenticateUser, UsersController.getAllUsersController)

module.exports = router
