const router = require('express').Router()
const UWFinancePurchasesController = require('../controller/uwfinancepurchases.controller')
const { authenticateUser } = require('../auth/middleware')

router
    .route('/')
    .get(
        authenticateUser,
        UWFinancePurchasesController.getAllUWFinancePurchasesController
    )
router
    .route('/')
    .post(
        authenticateUser,
        UWFinancePurchasesController.createNewUWFinancePurchaseController
    )
router
    .route('/:id')
    .get(
        authenticateUser,
        UWFinancePurchasesController.getUWFinancePurchaseController
    )
router
    .route('/:id')
    .patch(
        authenticateUser,
        UWFinancePurchasesController.updateUWFinancePurchaseController
    )
router
    .route('/:id/update_fi_link/:fi_link')
    .patch(
        authenticateUser,
        UWFinancePurchasesController.updateFILinkUWFinancePurchaseController
    )
router
    .route('/updateapprovals/:id')
    .patch(
        authenticateUser,
        UWFinancePurchasesController.updateApprovalsUWFinancePurchaseController
    )
router
    .route('/:id')
    .delete(
        authenticateUser,
        UWFinancePurchasesController.deleteUWFinancePurchaseController
    )
router
    .route('/getsponsorshipfund/:id')
    .get(
        authenticateUser,
        UWFinancePurchasesController.getSponsorshipFundByUPRController
    )

module.exports = router
