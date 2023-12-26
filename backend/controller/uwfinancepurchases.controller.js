const { APPROVAL_LEVELS } = require('../models/constants')
const {
    getAllUWFinancePurchases,
    getUWFinancePurchase,
    createNewUWFinancePurchase,
    updateUWFinancePurchase,
    updateFILinkUWFinancePurchase,
    updateApprovalsUWFinancePurchase,
    deleteUWFinancePurchase,
    getSponsorshipFundByUPR,
} = require('../service/uwfinancepurchases.service')
const FundingItem = require('../models/fundingitem.model')

const getAllUWFinancePurchasesController = (_, res) => {
    getAllUWFinancePurchases()
        .then((uwFinancePurchases) => {
            res.status(200).json(uwFinancePurchases)
        })
        .catch((err) => res.status(500).json('Error: ' + err))
}

const getUWFinancePurchaseController = (req, res) => {
    getUWFinancePurchase(req.params.id)
        .then((uwFinancePurchase) => res.status(200).json(uwFinancePurchase))
        .catch((err) => res.status(500).json('Error: ' + err))
}

const createNewUWFinancePurchaseController = (req, res) => {
    createNewUWFinancePurchase(req.body)
        .then((newUPR) => res.status(200).json(newUPR))
        .catch((err) => res.status(500).json('Error: ' + err))
}

const updateUWFinancePurchaseController = (req, res) => {
    if (!req.user.isDirector && !req.user.isReporter) {
        res.status(403).json('Error: Must be Director+ or reporter to update')
        return
    }

    if (req.body.fi_link) {
        res.status(400).json(
            'Error: fi_link in UPR must be patched via /update_fi_link'
        )
        return
    }

    updateUWFinancePurchase(req.params.id, req.body)
        .then((updatedUPR) => res.status(200).json(updatedUPR))
        .catch((err) => res.status(500).json('Error: ' + err))
}

const updateFILinkUWFinancePurchaseController = async (req, res) => {
    if (!req.user.isDirector && !req.user.isReporter) {
        res.status(403).json('Error: Must be Director+ or reporter to update')
        return
    }

    const { fi_link } = req.params

    const newFI = await FundingItem.exists({ _id: fi_link })
    if (!newFI) {
        res.status(400).json('Error: FI with _id of fi_link does not exist')
        return
    }

    updateFILinkUWFinancePurchase(req.params.id, fi_link)
        .then((updatedUPR) => res.status(200).json(updatedUPR))
        .catch((err) => res.status(500).json('Error: ' + err))
}

const updateApprovalsUWFinancePurchaseController = async (req, res) => {
    const { new_approval_levels, approval_type } = req.body
    const canUpdateApproval =
        (approval_type === APPROVAL_LEVELS.admin_approval &&
            req.user.isAdmin) ||
        (approval_type === APPROVAL_LEVELS.team_captain_approval &&
            req.user.isTeamCaptain) ||
        (approval_type === APPROVAL_LEVELS.director_approval &&
            req.user.isDirector)

    if (!canUpdateApproval) {
        res.status(403).json('Error: Permission Denied')
        return
    }

    updateApprovalsUWFinancePurchase(req.params.id, new_approval_levels)
        .then((uwFinancePurchase) => {
            res.status(200).json(uwFinancePurchase)
        })
        .catch((err) => {
            res.status(500).json('Error: ' + err)
        })
}

const deleteUWFinancePurchaseController = (req, res) => {
    if (!req.user.isDirector && !req.user.isReporter) {
        res.status(403).json('Error: Must be Director+ or reporter to delete')
        return
    }
    deleteUWFinancePurchase(req.params.id)
        .then((deleted) => res.status(200).json(deleted))
        .catch((err) => res.status(500).json('Error: ' + err))
}

const getSponsorshipFundByUPRController = (req, res) => {
    getSponsorshipFundByUPR(req.params.id)
        .then((sponsorshipFund) => {
            res.status(200).json(sponsorshipFund)
        })
        .catch((err) => res.status(500).json('Error: ' + err))
}

module.exports = {
    getAllUWFinancePurchasesController,
    getUWFinancePurchaseController,
    createNewUWFinancePurchaseController,
    updateUWFinancePurchaseController,
    updateFILinkUWFinancePurchaseController,
    updateApprovalsUWFinancePurchaseController,
    deleteUWFinancePurchaseController,
    getSponsorshipFundByUPRController,
}
