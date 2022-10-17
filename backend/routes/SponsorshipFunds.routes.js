const router = require('express').Router()
let SponsorshipFundController = require('../controllers/sponsorshipfunds.controller')

router.route('/').get(SponsorshipFundController.getAllSponsorshipFunds)
router.route('/').post(SponsorshipFundController.createSponsorshipFund)
router.route('/:id').get(SponsorshipFundController.getSponsorshipFund)
router.route('/:id').put(SponsorshipFundController.updateSponsorshipFund)
router.route('/:id').delete(SponsorshipFundController.deleteSponsorshipFund)

module.exports = router
