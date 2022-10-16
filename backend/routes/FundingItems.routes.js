const router = require('express').Router()
const FundingItemsModel = require('../controllers/FundingItems.controller')

router.route('/').get(FundingItemsModel.getAllFundingItems)
router.route('/').post(FundingItemsModel.createFundingItem)
router.route('/:id').get(FundingItemsModel.getFundingItem)
router.route('/:id').put(FundingItemsModel.updateFundingItem)
router.route('/:id').delete(FundingItemsModel.deleteFundingItem)

module.exports = router
