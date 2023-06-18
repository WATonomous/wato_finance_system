const router = require('express').Router()
const UWFinancePurchasesController = require('../controller/uwfinancepurchases.controller')

router
    .route('/')
    .get(UWFinancePurchasesController.getAllUWFinancePurchasesController)
router
    .route('/')
    .post(UWFinancePurchasesController.createNewUWFinancePurchaseController)
router
    .route('/:id')
    .get(UWFinancePurchasesController.getUWFinancePurchaseController)
router
    .route('/:id')
    .patch(UWFinancePurchasesController.updateUWFinancePurchaseController)
router
    .route('/updatefilink/:id')
    .patch(UWFinancePurchasesController.updateFILinkUWFinancePurchaseController)
router
    .route('/updateapprovals/:id')
    .patch(
        UWFinancePurchasesController.updateApprovalsUWFinancePurchaseController
    )
router
    .route('/:id')
    .delete(UWFinancePurchasesController.deleteUWFinancePurchaseController)
router
    .route('/getsponsorshipfund/:id')
    .get(UWFinancePurchasesController.getSponsorshipFundByUPRController)

module.exports = router
