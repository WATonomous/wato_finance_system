const router = require('express').Router()
const UWFinancePurchaseController = require('../controllers/uwfinancepurchases.controller')

router.route('/').get(UWFinancePurchaseController.getAllUWFinancePurchases)
router.route('/').post(UWFinancePurchaseController.createNewUWFinancePurchase)
router.route('/:id').get(UWFinancePurchaseController.getUWFinancePurchase)
router.route('/:id').put(UWFinancePurchaseController.updateUWFinancePurchase)
router.route('/:id').delete(UWFinancePurchaseController.deleteUWFinancePurchase)

module.exports = router
