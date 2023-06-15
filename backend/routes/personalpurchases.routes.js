const router = require('express').Router()
const PersonalPurchasesController = require('../controller/personalpurchases.controller')

const { authenticateUser } = require('../auth/middleware')
router
    .route('/')
    .get(
        authenticateUser,
        PersonalPurchasesController.getAllPersonalPurchasesController
    )
router
    .route('/')
    .post(
        authenticateUser,
        PersonalPurchasesController.createPersonalPurchaseController
    )
router
    .route('/:id')
    .get(
        authenticateUser,
        PersonalPurchasesController.getPersonalPurchaseController
    )
router
    .route('/:id')
    .patch(
        authenticateUser,
        PersonalPurchasesController.updatePersonalPurchaseController
    )
router
    .route('/:id/update_fi_link/:fi_link')
    .patch(
        authenticateUser,
        PersonalPurchasesController.updateFILinkPersonalPurchaseController
    )
router
    .route('/updateapprovals/:id')
    .patch(
        authenticateUser,
        PersonalPurchasesController.updateApprovalsPersonalPurchaseController
    )
router
    .route('/:id')
    .delete(
        authenticateUser,
        PersonalPurchasesController.deletePersonalPurchaseController
    )
router
    .route('/getsponsorshipfund/:id')
    .get(
        authenticateUser,
        PersonalPurchasesController.getSponsorshipFundByPPRController
    )

module.exports = router
