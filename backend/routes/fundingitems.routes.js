const router = require('express').Router()
const FundingItemsHandler = require('../controller/fundingitems.controller')

router.route('/').get(FundingItemsHandler.getAllFundingItemsController)
router.route('/').post(FundingItemsHandler.createFundingItemController)
router.route('/:id').get(FundingItemsHandler.getFundingItemController)
router.route('/:id').patch(FundingItemsHandler.updateFundingItemController)
router.route('/:id').delete(FundingItemsHandler.deleteFundingItemController)

module.exports = router
