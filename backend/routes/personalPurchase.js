const router = require('express').Router()
let PersonalPurchase = require('../models/PersonalPurchaseRequest.model')

router.route('/').get((_, res) => {
    PersonalPurchase.find()
        .then((personalPurchases) => res.json(personalPurchases))
        .catch((err) => res.status(400).json('Error: ' + err))
})

router.route('/:id').get((req, res) => {
    PersonalPurchase.findById(req.params.id)
        .then((personalPurchase) => res.json(personalPurchase))
        .catch((err) => res.status(400).json('Error: ' + err))
})

router.route('/').post((req, res) => {
    const { body } = req
    console.log(body)
    const newPersonalPurchase = new PersonalPurchase(body)

    newPersonalPurchase
        .save()
        .then(() => res.json(newPersonalPurchase))
        .catch((err) => res.status(400).json('Error: ' + err))
})

router.route('/:id').put((req, res) => {
    console.log(req.params.id)
    PersonalPurchase.findByIdAndUpdate(req.params.id, req.body)
        .then(() => res.json(req.body))
        .catch((err) => res.status(400).json('Error: ' + err))
})

router.route('/:id').delete((req, res) => {
    PersonalPurchase.findByIdAndDelete(req.params.id)
        .then(() => res.json('PersonalPurchase deleted.'))
        .catch((err) => res.status(400).json('Error: ' + err))
})

module.exports = router
