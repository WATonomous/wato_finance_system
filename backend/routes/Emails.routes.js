const router = require('express').Router()
const EmailsController = require('../controllers/Emails.controller')

router.route('/').post(EmailsController.createEmail)

module.exports = router
