const {
    getAllPersonalPurchases,
    getPersonalPurchase,
    createPersonalPurchase,
    updatePersonalPurchase,
    updateFILinkPersonalPurchase,
    updateApprovalsPersonalPurchase,
    deletePersonalPurchase,
    getSponsorshipFundByPPR,
} = require('../service/personalpurchases.service')
const { APPROVAL_LEVELS } = require('../models/constants')
const FundingItem = require('../models/fundingitem.model')

const getAllPersonalPurchasesController = (_, res) => {
    getAllPersonalPurchases()
        .then((personalPurchases) => res.status(200).json(personalPurchases))
        .catch((err) => res.status(500).json('Error: ' + err))
}

const getPersonalPurchaseController = (req, res) => {
    getPersonalPurchase(req.params.id)
        .then((personalPurchase) => res.status(200).json(personalPurchase))
        .catch((err) => res.status(500).json('Error: ' + err))
}

const createPersonalPurchaseController = (req, res) => {
    createPersonalPurchase(req.body)
        .then((newPPR) => res.status(200).json(newPPR))
        .catch((err) => res.status(500).json('Error: ' + err))
}

const updatePersonalPurchaseController = (req, res) => {
    if (!req.user.isAdmin && !req.user.isReporter) {
        res.status(403).json('Error: Must be admin or reporter to update')
        return
    }

    if (req.body.fi_link) {
        res.status(400).json(
            'Error: fi_link in PPR must be patched via /update_fi_link'
        )
        return
    }

    updatePersonalPurchase(req.params.id, req.body)
        .then((updatedPPR) => res.status(200).json(updatedPPR))
        .catch((err) => res.status(500).json('Error: ' + err))
}

const updateFILinkPersonalPurchaseController = async (req, res) => {
    if (!req.user.isAdmin && !req.user.isReporter) {
        res.status(403).json('Error: Must be admin or reporter to update')
        return
    }
    const { fi_link } = req.params

    const newFI = await FundingItem.exists({ _id: fi_link })
    if (!newFI) {
        res.status(400).json('Error: FI with _id of fi_link does not exist')
        return
    }

    updateFILinkPersonalPurchase(req.params.id, fi_link)
        .then((updatedPPR) => res.status(200).json(updatedPPR))
        .catch((err) => res.status(500).json('Error: ' + err))
}

const updateApprovalsPersonalPurchaseController = async (req, res) => {
    const { new_approval_levels } = req.body

    if (!req.user.isAdmin) {
        res.status(403).json('Error: Permission Denied')
        return
    }

    updateApprovalsPersonalPurchase(req.params.id, new_approval_levels)
        .then((personalpurchase) => {
            res.status(200).json(personalpurchase)
        })
        .catch((err) => res.status(500).json('Error: ' + err))
}

const deletePersonalPurchaseController = (req, res) => {
    if (!req.user.isAdmin && !req.user.isReporter) {
        res.status(403).json('Error: Must be admin or reporter to delete')
        return
    }
    deletePersonalPurchase(req.params.id)
        .then((deleted) => res.status(200).json(deleted))
        .catch((err) => res.status(500).json('Error: ' + err))
}

const getSponsorshipFundByPPRController = async (req, res) => {
    getSponsorshipFundByPPR(req.params.id)
        .then((sponsorshipFund) => res.status(200).json(sponsorshipFund))
        .catch((err) => res.status(500).json('Error: ' + err))
}

module.exports = {
    getAllPersonalPurchasesController,
    getPersonalPurchaseController,
    createPersonalPurchaseController,
    updatePersonalPurchaseController,
    updateFILinkPersonalPurchaseController,
    updateApprovalsPersonalPurchaseController,
    deletePersonalPurchaseController,
    getSponsorshipFundByPPRController,
}
