const router = require('express').Router()
let SponsorshipFundsController = require('../controllers/sponsorshipfunds.controller')

router.route('/').get(SponsorshipFundsController.getAllSponsorshipFunds)
router.route('/').post(SponsorshipFundsController.createSponsorshipFund)
router.route('/:id').get(SponsorshipFundsController.getSponsorshipFund)
router.route('/:id').put(SponsorshipFundsController.updateSponsorshipFund)
router.route('/:id').delete(SponsorshipFundsController.deleteSponsorshipFund)

module.exports = router
