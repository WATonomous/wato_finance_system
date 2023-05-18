const router = require('express').Router()
const GoogleGroup = require('../controllers/googlegroup.controller')

router.route('/').get(GoogleGroup.getAllGoogleGroupsControl)
router.route('/:identifier').get(GoogleGroup.getGoogleGroupControl)
router.route('/update').post(GoogleGroup.updateGoogleGroups)

module.exports = router
