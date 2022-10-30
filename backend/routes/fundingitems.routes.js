const router = require('express').Router()
const FundingItemsController = require('../controllers/fundingitems.controller')

router.route('/').get(FundingItemsController.getAllFundingItems)
router.route('/').post(FundingItemsController.createFundingItem)
router.route('/:id').get(FundingItemsController.getFundingItem)
router.route('/:id').put(FundingItemsController.updateFundingItem)
router.route('/:id').delete(FundingItemsController.deleteFundingItem)

module.exports = router
