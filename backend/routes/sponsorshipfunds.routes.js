const router = require('express').Router()
const SponsorshipFundsController = require('../controller/sponsorshipfunds.controller')

router
    .route('/')
    .get(SponsorshipFundsController.getAllSponsorshipFundsController)
router
    .route('/')
    .post(SponsorshipFundsController.createSponsorshipFundController)
router
    .route('/:id')
    .get(SponsorshipFundsController.getSponsorshipFundController)
router
    .route('/getallchildren/:id')
    .get(SponsorshipFundsController.getAllChildrenController)
router
    .route('/:id')
    .patch(SponsorshipFundsController.updateSponsorshipFundController)
router
    .route('/:id')
    .delete(SponsorshipFundsController.deleteSponsorshipFundController)

module.exports = router
