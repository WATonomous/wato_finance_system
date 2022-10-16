const router = require('express').Router()
const PersonalPurchasesController = require('../controllers/PersonalPurchases.controller')

router.route('/').get(PersonalPurchasesController.getAllPersonalPurchases)
router.route('/').post(PersonalPurchasesController.createPersonalPurchase)
router.route('/:id').get(PersonalPurchasesController.getPersonalPurchase)
router.route('/:id').put(PersonalPurchasesController.updatePersonalPurchase)
router.route('/:id').delete(PersonalPurchasesController.deletePersonalPurchase)

module.exports = router
