const { APPROVAL_LEVELS } = require('../models/constants')
const { getAuthRoles } = require('./getAuthRoles')
const {
    getAllUWFinancePurchases,
    getUWFinancePurchase,
    createNewUWFinancePurchase,
    updateUWFinancePurchase,
    updateApprovalsUWFinancePurchase,
    deleteUWFinancePurchase,
    getSponsorshipFundByUPR,
} = require('../service/uwfinancepurchases.service')

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
    if (req.body.fi_link) {
        res.status(400).json('Error: fi_link in UPR cannot be patched')
        return
    }

    updateUWFinancePurchase(req.params.id, req.body)
        .then((updatedUPR) => res.status(200).json(updatedUPR))
        .catch((err) => res.status(500).json('Error: ' + err))
}

const updateApprovalsUWFinancePurchaseController = async (req, res) => {
    const { ticket_data, approval_type, identifier } = req.body

    const { isAdmin, isTeamCaptain, isDirector } = await getAuthRoles(
        identifier
    )
    const canUpdateApproval =
        (approval_type === APPROVAL_LEVELS.admin_approval && isAdmin) ||
        (approval_type === APPROVAL_LEVELS.team_captain_approval &&
            isTeamCaptain) ||
        (approval_type === APPROVAL_LEVELS.director_approval && isDirector)

    if (canUpdateApproval) {
        return updateApprovalsUWFinancePurchase(req.params.id, ticket_data)
            .then((uwFinancePurchase) => {
                res.status(200).json(uwFinancePurchase)
            })
            .catch((err) => res.status(500).json('Error: ' + err))
    }
    res.status(403).json('Error: Permission Denied')
}

const deleteUWFinancePurchaseController = (req, res) => {
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
    updateApprovalsUWFinancePurchaseController,
    deleteUWFinancePurchaseController,
    getSponsorshipFundByUPRController,
}
