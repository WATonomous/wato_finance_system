const router = require('express').Router()
const GoogleGroup = require('../controller/googlegroup.controller')

router.route('/').get(GoogleGroup.getAllGoogleGroupsController)
router.route('/:identifier').get(GoogleGroup.getGoogleGroupController)
router.route('/update').post(GoogleGroup.updateGoogleGroupsController)

module.exports = router
