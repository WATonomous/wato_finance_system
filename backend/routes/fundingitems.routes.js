const router = require('express').Router()
const FundingItemsController = require('../controller/fundingitems.controller')

router.route('/').get(FundingItemsController.getAllFundingItemsController)
router.route('/').post(FundingItemsController.createFundingItemController)
router.route('/:id').get(FundingItemsController.getFundingItemController)
router.route('/:id').patch(FundingItemsController.updateFundingItemController)
router
    .route('/:id/update_sf_link/:sf_link')
    .patch(FundingItemsController.updateSFLinkFundingItemController)
router.route('/:id').delete(FundingItemsController.deleteFundingItemController)

module.exports = router
