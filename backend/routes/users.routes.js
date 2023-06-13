const router = require('express').Router()
const UsersController = require('../controller/users.controller')

router.route('/').get(UsersController.getAllUsersController)

module.exports = router
