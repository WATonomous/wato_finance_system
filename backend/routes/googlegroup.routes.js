const router = require('express').Router()
const GoogleGroup = require('../controllers/googlegroup.controller')

router.route('/').get(GoogleGroup.getAllGoogleGroups)
router.route('/').post(GoogleGroup.getGoogleGroup)
router.route('/update').post(GoogleGroup.updateGoogleGroups)

module.exports = router
