const router = require('express').Router()
const UWFinancePurchasesController = require('../controller/uwfinancepurchases.controller')
const { validateUser } = require('../auth/middleware')

router
    .route('/')
    .get(
        validateUser,
        UWFinancePurchasesController.getAllUWFinancePurchasesController
    )
router
    .route('/')
    .post(
        validateUser,
        UWFinancePurchasesController.createNewUWFinancePurchaseController
    )
router
    .route('/:id')
    .get(
        validateUser,
        UWFinancePurchasesController.getUWFinancePurchaseController
    )
router
    .route('/:id')
    .patch(
        validateUser,
        UWFinancePurchasesController.updateUWFinancePurchaseController
    )
router
    .route('/updateapprovals/:id')
    .patch(
        validateUser,
        UWFinancePurchasesController.updateApprovalsUWFinancePurchaseController
    )
router
    .route('/:id')
    .delete(
        validateUser,
        UWFinancePurchasesController.deleteUWFinancePurchaseController
    )
router
    .route('/getsponsorshipfund/:id')
    .get(
        validateUser,
        UWFinancePurchasesController.getSponsorshipFundController
    )

module.exports = router
