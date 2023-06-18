const router = require('express').Router()
const PersonalPurchasesController = require('../controller/personalpurchases.controller')

router
    .route('/')
    .get(PersonalPurchasesController.getAllPersonalPurchasesController)
router
    .route('/')
    .post(PersonalPurchasesController.createPersonalPurchaseController)
router
    .route('/:id')
    .get(PersonalPurchasesController.getPersonalPurchaseController)
router
    .route('/:id')
    .patch(PersonalPurchasesController.updatePersonalPurchaseController)
router
    .route('/updatefilink/:id')
    .patch(PersonalPurchasesController.updateFILinkPersonalPurchaseController)
router
    .route('/updateapprovals/:id')
    .patch(
        PersonalPurchasesController.updateApprovalsPersonalPurchaseController
    )
router
    .route('/:id')
    .delete(PersonalPurchasesController.deletePersonalPurchaseController)
router
    .route('/getsponsorshipfund/:id')
    .get(PersonalPurchasesController.getSponsorshipFundByPPRController)

module.exports = router
