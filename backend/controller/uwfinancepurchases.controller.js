const { APPROVAL_LEVELS } = require('../models/constants')
const { getAuthRoles } = require('./getAuthRoles')
const {
    getAllUWFinancePurchases,
    getUWFinancePurchase,
    createNewUWFinancePurchase,
    updateUWFinancePurchase,
    updateApprovalsUWFinancePurchase,
    deleteUWFinancePurchase,
    getSponsorshipFund,
} = require('../service/uwfinancepurchases.service')

const getAllUWFinancePurchasesController = (_, res) => {
    getAllUWFinancePurchases()
        .then((uwFinancePurchases) => {
            res.status(200).json(uwFinancePurchases)
        })
        .catch((err) => res.status(400).json('Error: ' + err))
}

const getUWFinancePurchaseController = (req, res) => {
    getUWFinancePurchase(req.params.id)
        .then((uwFinancePurchase) => res.status(200).json(uwFinancePurchase))
        .catch((err) => res.status(400).json('Error: ' + err))
}

const createNewUWFinancePurchaseController = async (req, res) => {
    createNewUWFinancePurchase(req.body)
        .then((newUPR) => res.status(200).json(newUPR))
        .catch((err) => res.status(400).json('Error: ' + err))
}

const updateUWFinancePurchaseController = (req, res) => {
    updateUWFinancePurchase(req.params.id, req.body)
        .then(() => res.status(200).json(req.body))
        .catch((err) => res.status(400).json('Error: ' + err))
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
        return updateApprovalsUWFinancePurchase(ticket_data)
            .then((uwFinancePurchase) => {
                res.status(200).json(uwFinancePurchase)
            })
            .catch((err) => res.status(400).json('Error: ' + err))
    }
    res.status(403).json('Error: Permission Denied')
}

const deleteUWFinancePurchaseController = async (req, res) => {
    deleteUWFinancePurchase(req.params.id)
        .then((deleted) => res.status(200).json(deleted))
        .catch((err) => res.status(400).json('Error: ' + err))
}

const getSponsorshipFundController = async (req, res) => {
    getSponsorshipFund(req.params.id)
        .then((sponsorshipFund) => {
            res.status(200).json(sponsorshipFund)
        })
        .catch((err) => res.status(400).json('Error: ' + err))
}

module.exports = {
    getAllUWFinancePurchasesController,
    getUWFinancePurchaseController,
    createNewUWFinancePurchaseController,
    updateUWFinancePurchaseController,
    updateApprovalsUWFinancePurchaseController,
    deleteUWFinancePurchaseController,
    getSponsorshipFundController,
}
