const router = require('express').Router()
let UWFinancePurchase = require('../models/UWFinancePurchaseRequest.model')

router.route('/').get((_, res) => {
    UWFinancePurchase.find()
        .then((UWFinancePurchase) => res.json(UWFinancePurchase))
        .catch((err) => res.status(400).json('Error: ' + err))
})

router.route('/:id').get((req, res) => {
    UWFinancePurchase.findById(req.params.id)
        .then((UWFinancePurchase) => res.json(UWFinancePurchase))
        .catch((err) => res.status(400).json('Error: ' + err))
})

router.route('/').post((req, res) => {
    const { body } = req
    const newUWFinancePurchase  = new UWFinancePurchase(body)

    newUWFinancePurchase 
        .save()
        .then(() => res.json(newUWFinancePurchase ))
        .catch((err) => res.status(400).json('Error: ' + err))
})

router.route('/:id').put((req, res) => {
    UWFinancePurchase.findByIdAndUpdate(req.params.id, req.body)
        .then(() => res.json(req.body))
        .catch((err) => res.status(400).json('Error: ' + err))
})

router.route('/:id').delete((req, res) => {
    UWFinancePurchase.findByIdAndDelete(req.params.id)
        .then(() => res.json('UWFinancePurchase deleted.'))
        .catch((err) => res.status(400).json('Error: ' + err))
})

module.exports = router
