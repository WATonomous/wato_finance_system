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
        .then((sponsorshipFund) => {
            res.status(200).json(sponsorshipFund)
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

const updateSponsorshipFundController = (req, res) => {
    if (!req.user.isAdmin && !req.user.isReporter) {
        res.status(403).json('Error: Must be admin or reporter to update')
        return
    }

    if (req.body.fi_links) {
        res.status(400).json('Error: fi_links in SF cannot be patched')
        return
    }

    updateSponsorshipFund(req.params.id, req.body)
        .then((updatedSF) => res.status(200).json(updatedSF))
        .catch((err) => res.status(500).json('Error: ' + err))
}

const deleteSponsorshipFundController = (req, res) => {
    if (!req.user.isAdmin && !req.user.isReporter) {
        res.status(403).json('Error: Must be admin or reporter to delete')
        return
    }

    deleteSponsorshipFund(req.params.id)
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
