const router = require('express').Router()
const EmailsController = require('../controllers/emails.controller')

router.route('/').post(EmailsController.createEmail)
module.exports = router
