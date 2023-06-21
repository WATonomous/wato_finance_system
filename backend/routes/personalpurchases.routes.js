const router = require('express').Router()
const PersonalPurchasesController = require('../controller/personalpurchases.controller')

const { validateUser } = require('../auth/middleware')
router
    .route('/')
    .get(
        validateUser,
        PersonalPurchasesController.getAllPersonalPurchasesController
    )
router
    .route('/')
    .post(
        validateUser,
        PersonalPurchasesController.createPersonalPurchaseController
    )
router
    .route('/:id')
    .get(
        validateUser,
        PersonalPurchasesController.getPersonalPurchaseController
    )
router
    .route('/:id')
    .patch(
        validateUser,
        PersonalPurchasesController.updatePersonalPurchaseController
    )
router
    .route('/:id/update_fi_link/:fi_link')
    .patch(
        validateUser,
        PersonalPurchasesController.updateFILinkPersonalPurchaseController
    )
router
    .route('/updateapprovals/:id')
    .patch(
        validateUser,
        PersonalPurchasesController.updateApprovalsPersonalPurchaseController
    )
router
    .route('/:id')
    .delete(
        validateUser,
        PersonalPurchasesController.deletePersonalPurchaseController
    )
router
    .route('/getsponsorshipfund/:id')
    .get(
        validateUser,
        PersonalPurchasesController.getSponsorshipFundByPPRController
    )

module.exports = router
