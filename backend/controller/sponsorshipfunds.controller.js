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
            res.status(200).json(sponsorshipFunds)
        })
        .catch((err) => res.status(500).json('Error: ' + err))
}

const getSponsorshipFundController = (req, res) => {
    getSponsorshipFund(req.params.id)
        .then((sponsorshipFunds) => {
            res.status(200).json(sponsorshipFunds[0])
        })
        .catch((err) => res.status(500).json('Error: ' + err))
}

// this function reaches all the way down to the children
const getAllChildrenController = async (req, res) => {
    getAllChildren(req.params.id)
        .then((sponsorshipFund) => {
            res.status(200).json(sponsorshipFund)
        })
        .catch((err) => res.status(500).json('Error: ' + err))
}

const createSponsorshipFundController = (req, res) => {
    createSponsorshipFund(req.body)
        .then((newSF) => res.status(200).json(newSF))
        .catch((err) => res.status(500).json('Error: ' + err))
}

const updateSponsorshipFundController = async (req, res) => {
    const { id } = req.params
    const { updatedFields } = req.body
    updateSponsorshipFund(id, updatedFields)
        .then((updatedSF) => res.status(200).json(updatedSF))
        .catch((err) => res.status(500).json('Error: ' + err))
}

const deleteSponsorshipFundController = async (req, res) => {
    const { id } = req.params
    deleteSponsorshipFund(id)
        .then((deleted) => res.status(200).json(deleted))
        .catch((err) => res.status(500).json('Error: ' + err))
}

module.exports = {
    getAllSponsorshipFundsController,
    createSponsorshipFundController,
    getSponsorshipFundController,
    updateSponsorshipFundController,
    deleteSponsorshipFundController,
    getAllChildrenController,
}
