const {
    getAllSponsorshipFunds,
    getSponsorshipFund,
    createSponsorshipFund,
    updateSponsorshipFund,
    deleteSponsorshipFund,
    getAllChildren,
} = require('../service/sponsorshipfunds.service')

const getAllSponsorshipFundsController = (_, res) => {
    getAllSponsorshipFunds()
        .then((sponsorshipFunds) => {
            res.json(sponsorshipFunds)
        })
        .catch((err) => res.status(400).json(err))
}

const getSponsorshipFundController = (req, res) => {
    getSponsorshipFund(req.params.id)
        .then((sponsorshipFunds) => {
            res.json(sponsorshipFunds[0])
        })
        .catch((err) => res.status(400).json(err))
}

// this function reaches all the way down to the children
const getAllChildrenController = async (req, res) => {
    getAllChildren(req.params.id)
        .then((sponsorshipFund) => {
            res.json(sponsorshipFund)
        })
        .catch((err) => res.status(400).json(err))
}

const createSponsorshipFundController = (req, res) => {
    createSponsorshipFund(req.body)
        .then((newSF) => res.json(newSF))
        .catch((err) => res.status(400).json(err))
}

const updateSponsorshipFundController = async (req, res) => {
    const { id } = req.params
    const { updatedFields } = req.body
    updateSponsorshipFund(id, updatedFields)
        .then((updatedSF) => res.json(updatedSF))
        .catch((err) => res.status(400).json(err))
}

const deleteSponsorshipFundController = async (req, res) => {
    const { id } = req.params
    deleteSponsorshipFund(id)
        .then((deleted) => res.json(deleted))
        .catch((err) => res.status(400).json(err))
}

module.exports = {
    getAllSponsorshipFundsController,
    createSponsorshipFundController,
    getSponsorshipFundController,
    updateSponsorshipFundController,
    deleteSponsorshipFundController,
    getAllChildrenController,
}
