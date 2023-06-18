const router = require('express').Router()
const FundingItemsController = require('../controller/fundingitems.controller')
const { validateUser } = require('../auth/middleware')

router
    .route('/')
    .get(validateUser, FundingItemsController.getAllFundingItemsController)
router
    .route('/')
    .post(validateUser, FundingItemsController.createFundingItemController)
router
    .route('/:id')
    .get(validateUser, FundingItemsController.getFundingItemController)
router
    .route('/:id')
    .patch(validateUser, FundingItemsController.updateFundingItemController)
router
    .route('/:id')
    .delete(validateUser, FundingItemsController.deleteFundingItemController)

module.exports = router
