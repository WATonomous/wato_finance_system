const router = require('express').Router()
const GoogleGroup = require('../controller/googlegroup.controller')
const { validateUser } = require('../auth/middleware')

router.route('/').get(validateUser, GoogleGroup.getAllGoogleGroupsController)
router
    .route('/:identifier')
    .get(validateUser, GoogleGroup.getGoogleGroupController)
router
    .route('/update')
    .post(validateUser, GoogleGroup.updateGoogleGroupsController)

module.exports = router
