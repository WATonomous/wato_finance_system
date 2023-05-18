const router = require('express').Router()
const UWFinancePurchasesController = require('../controllers/uwfinancepurchases.controller')

router.route('/').get(UWFinancePurchasesController.getAllUWFinancePurchases)
router.route('/').post(UWFinancePurchasesController.createNewUWFinancePurchase)
router.route('/:id').get(UWFinancePurchasesController.getUWFinancePurchase)
router.route('/:id').put(UWFinancePurchasesController.updateUWFinancePurchase)
router
    .route('/updateapprovals/:id')
    .put(UWFinancePurchasesController.updateApprovalsUWFinancePurchase)
router
    .route('/:id')
    .delete(UWFinancePurchasesController.deleteUWFinancePurchase)
router
    .route('/getsponsorshipfund/:id')
    .get(UWFinancePurchasesController.getSponsorshipFund)

module.exports = router
