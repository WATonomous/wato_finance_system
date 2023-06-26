const router = require('express').Router()
const GoogleGroup = require('../controller/googlegroup.controller')
const { authenticateUser } = require('../auth/middleware')

router
    .route('/')
    .get(authenticateUser, GoogleGroup.getAllGoogleGroupsController)
router
    .route('/:identifier')
    .get(authenticateUser, GoogleGroup.getGoogleGroupController)
router
    .route('/update')
    .post(authenticateUser, GoogleGroup.updateGoogleGroupsController)

module.exports = router
