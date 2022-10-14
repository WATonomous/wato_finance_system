const router = require('express').Router()
let FundingItem = require('../models/FundingItem.model')
let FICounter = require('../models/AutoCounter.model')

router.route('/').get((_, res) => {
    FundingItem.find()
        .then((fundingItems) => res.json(fundingItems))
        .catch((err) => res.status(400).json('Error: ' + err))
})

router.route('/:id').get((req, res) => {
    FundingItem.findById(req.params.id)
        .then((fundingItem) => res.json(fundingItem))
        .catch((err) => res.status(400).json('Error: ' + err))
})

router.route('/').post((req, res) => {
    FICounter.findOneAndUpdate(
        { _id: 'FundingItems' },
        { $inc: { seq: 1 } },
        { new: true },
        (err, counter) => {
            let ticketId
            if (counter == null) {
                const newCounter = new FICounter({
                    _id: 'FundingItems',
                    seq: 1,
                })
                newCounter.save()
                ticketId = 1
            } else {
                ticketId = counter.seq
            }
            const newFundingItem = new FundingItem({
                ticket_id: ticketId,
                ...req.body,
            })
            newFundingItem
                .save()
                .then(() => res.json(newFundingItem))
                .catch((err) => res.status(400).json('Error: ' + err))
        }
    )
})

router.route('/:id').put((req, res) => {
    FundingItem.findByIdAndUpdate(req.params.id, req.body)
        .then(() => res.json(req.body))
        .catch((err) => res.status(400).json('Error: ' + err))
})

router.route('/:id').delete((req, res) => {
    FundingItem.findByIdAndDelete(req.params.id)
        .then(() => res.json('FundingItem deleted.'))
        .catch((err) => res.status(400).json('Error: ' + err))
})

module.exports = router
