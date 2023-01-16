const router = require('express').Router()
const UsersController = require('../controllers/users.controller')

router.route('/').get(UsersController.getAllUsers)

module.exports = router
