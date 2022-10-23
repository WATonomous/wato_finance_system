const router = require('express').Router()
let SponsorshipFund = require('../models/SponsorshipFund.model')

router.route('/').get((_, res) => {
    SponsorshipFund.find()
        .then((SponsorshipFund) => res.json(SponsorshipFund))
        .catch((err) => res.status(400).json(err))
})

router.route('/').post((req, res) => {
    const { body } = req
    SponsorshipFund.create(body)
        .then((body) => res.status(200).json(body))
        .catch((err) => res.status(400).json(err))
})

router.route('/:id').put((req, res) => {
    const { id } = req.params
    const updatedFields = req.body
    SponsorshipFund.findById(id)
        .then((sponsorshipFundToUpdate) => {
            if (!sponsorshipFundToUpdate) {
                res.status(404)
                throw new Error('Sponsorship Fund not found')
            }
            SponsorshipFund.findByIdAndUpdate(
                sponsorshipFundToUpdate._id,
                updatedFields,
                {
                    new: false,
                }
            )
                .then(() => res.status(200).json(updatedFields))
                .catch((err) => res.status(400).json(err))
        })
        .catch((err) => res.status(400).json(err))
})

router.route('/:id').delete((req, res) => {
    const { id } = req.params
    SponsorshipFund.findById(id)
        .then((sponsorshipFundToDelete) => {
            if (!sponsorshipFundToDelete) {
                res.status(404)
                throw new Error('Sponsorship Fund not found')
            }
            res.status(200).json(sponsorshipFundToDelete)
            sponsorshipFundToDelete.remove()
        })
        .catch((err) => res.status(400).json(err))
})

router.route('/:id').get((req, res) => {
    const { id } = req.params
    SponsorshipFund.findById(id)
        .then((sponsorshipFundToRetrieve) => {
            if (!sponsorshipFundToRetrieve) {
                res.status(404)
                throw new Error('Sponsorship Fund not found')
            }
            res.status(200).json(sponsorshipFundToRetrieve)
        })
        .catch((err) => res.status(400).json(err))
})

module.exports = router
