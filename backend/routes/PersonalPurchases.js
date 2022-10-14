const router = require('express').Router()
let PersonalPurchase = require('../models/PersonalPurchaseRequest.model')
let PPRCounter = require('../models/AutoCounter.model')

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
    PPRCounter.findOneAndUpdate(
        { _id: 'PersonalPurchases' },
        { $inc: { seq: 1 } },
        { new: true },
        (err, counter) => {
            let ticketId
            if (counter == null) {
                const newCounter = new PPRCounter({
                    _id: 'PersonalPurchases',
                    seq: 1,
                })
                newCounter.save()
                ticketId = 1
            } else {
                ticketId = counter.seq
            }
            const newPersonalPurchase = new PersonalPurchase({
                ticket_id: ticketId,
                ...req.body,
            })
            newPersonalPurchase
                .save()
                .then(() => res.json(newPersonalPurchase))
                .catch((err) => res.status(400).json('Error: ' + err))
        }
    )
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
