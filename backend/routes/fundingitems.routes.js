const router = require('express').Router()
const FundingItemsController = require('../controller/fundingitems.controller')
const { authenticateUser } = require('../auth/middleware')

router
    .route('/')
    .get(authenticateUser, FundingItemsController.getAllFundingItemsController)
router
    .route('/')
    .post(authenticateUser, FundingItemsController.createFundingItemController)
router
    .route('/:id')
    .get(authenticateUser, FundingItemsController.getFundingItemController)
router
    .route('/:id')
    .patch(authenticateUser, FundingItemsController.updateFundingItemController)
router
    .route('/:id/update_sf_link/:sf_link')
    .patch(
        authenticateUser,
        FundingItemsController.updateSFLinkFundingItemController
    )
router
    .route('/:id')
    .delete(
        authenticateUser,
        FundingItemsController.deleteFundingItemController
    )

module.exports = router
