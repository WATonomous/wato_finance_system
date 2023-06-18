const router = require('express').Router()
const UsersController = require('../controller/users.controller')
const { validateUser } = require('../auth/middleware')

router.route('/').get(validateUser, UsersController.getAllUsersController)

module.exports = router
