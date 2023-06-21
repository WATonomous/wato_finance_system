const router = require('express').Router()
const SponsorshipFundsController = require('../controller/sponsorshipfunds.controller')

const { validateUser } = require('../auth/middleware')
router
    .route('/')
    .get(
        validateUser,
        SponsorshipFundsController.getAllSponsorshipFundsController
    )
router
    .route('/')
    .post(
        validateUser,
        SponsorshipFundsController.createSponsorshipFundController
    )
router
    .route('/:id')
    .get(validateUser, SponsorshipFundsController.getSponsorshipFundController)
router
    .route('/getallchildren/:id')
    .get(validateUser, SponsorshipFundsController.getAllChildrenController)
router
    .route('/:id')
    .patch(
        validateUser,
        SponsorshipFundsController.updateSponsorshipFundController
    )
router
    .route('/:id')
    .delete(
        validateUser,
        SponsorshipFundsController.deleteSponsorshipFundController
    )

module.exports = router
