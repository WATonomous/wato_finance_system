const {
    getAllPersonalPurchases,
    getPersonalPurchase,
    createPersonalPurchase,
    updatePersonalPurchase,
    updateApprovalsPersonalPurchase,
    deletePersonalPurchase,
} = require('../service/personalpurchases.service')
const { APPROVAL_LEVELS } = require('../models/constants')
const { getAuthRoles } = require('./getAuthRoles')

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
    if (req.body.fi_link) {
        res.status(400).json('Error: fi_link in PPR cannot be patched')
        return
    }

    updatePersonalPurchase(req.params.id, req.body)
        .then((updatedPPR) => res.status(200).json(updatedPPR))
        .catch((err) => res.status(500).json('Error: ' + err))
}

const updateApprovalsPersonalPurchaseController = async (req, res) => {
    const { ticket_data, approval_type, identifier } = req.body
    const { isAdmin, isTeamCaptain, isDirector } = await getAuthRoles(
        identifier
    )

    const canUpdateApproval =
        (approval_type === APPROVAL_LEVELS.admin_approval && isAdmin) ||
        (approval_type === APPROVAL_LEVELS.team_captain_approval &&
            isTeamCaptain) ||
        (approval_type === APPROVAL_LEVELS.director_approval && isDirector)

    if (!canUpdateApproval) {
        res.status(403).json('Error: Permission Denied')
        return
    }

    updateApprovalsPersonalPurchase(req.params.id, ticket_data)
        .then((personalpurchase) => {
            res.status(200).json(personalpurchase)
        })
        .catch((err) => res.status(500).json('Error: ' + err))
}

const deletePersonalPurchaseController = (req, res) => {
    deletePersonalPurchase(req.params.id)
        .then((deleted) => res.status(200).json(deleted))
        .catch((err) => res.status(500).json('Error: ' + err))
}

const getSponsorshipFundController = async (req, res) => {
    getSponsorshipFund(req.params.id)
        .then((sponsorshipFund) => res.status(200).json(sponsorshipFund))
        .catch((err) => res.status(500).json('Error: ' + err))
}

module.exports = {
    getAllPersonalPurchasesController,
    getPersonalPurchaseController,
    createPersonalPurchaseController,
    updatePersonalPurchaseController,
    updateApprovalsPersonalPurchaseController,
    deletePersonalPurchaseController,
    getSponsorshipFundController,
}
