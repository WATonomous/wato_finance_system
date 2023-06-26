const router = require('express').Router()
const SponsorshipFundsController = require('../controller/sponsorshipfunds.controller')

const { authenticateUser } = require('../auth/middleware')
router
    .route('/')
    .get(
        authenticateUser,
        SponsorshipFundsController.getAllSponsorshipFundsController
    )
router
    .route('/')
    .post(
        authenticateUser,
        SponsorshipFundsController.createSponsorshipFundController
    )
router
    .route('/:id')
    .get(
        authenticateUser,
        SponsorshipFundsController.getSponsorshipFundController
    )
router
    .route('/getallchildren/:id')
    .get(authenticateUser, SponsorshipFundsController.getAllChildrenController)
router
    .route('/:id')
    .patch(
        authenticateUser,
        SponsorshipFundsController.updateSponsorshipFundController
    )
router
    .route('/:id')
    .delete(
        authenticateUser,
        SponsorshipFundsController.deleteSponsorshipFundController
    )

module.exports = router
