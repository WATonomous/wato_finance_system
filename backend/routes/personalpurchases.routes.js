const router = require('express').Router()
const PersonalPurchasesController = require('../controllers/personalpurchases.controller')

router.route('/').get(PersonalPurchasesController.getAllPersonalPurchases)
router.route('/').post(PersonalPurchasesController.createPersonalPurchase)
router.route('/:id').get(PersonalPurchasesController.getPersonalPurchase)
router.route('/:id').patch(PersonalPurchasesController.updatePersonalPurchase)
router
    .route('/updateapprovals/:id')
    .patch(PersonalPurchasesController.updateApprovalsPersonalPurchase)
router.route('/:id').delete(PersonalPurchasesController.deletePersonalPurchase)
router
    .route('/getsponsorshipfund/:id')
    .get(PersonalPurchasesController.getSponsorshipFund)

module.exports = router
