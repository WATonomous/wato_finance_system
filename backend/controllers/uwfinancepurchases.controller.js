const UWFinancePurchase = require('../models/uwfinancepurchase.model')
const FundingItem = require('../models/fundingitem.model')
const {
    getAnnotatedSponsorshipFundsByIdList,
    getAnnotatedUWFinancePurchasesByIdList,
} = require('./annotatedGetters')
const { getGoogleGroup } = require('./googlegroup.controller')
const {
    APPROVAL_LEVELS,
    ADMIN_IDENTIFIERS,
    TEAM_CAPTAIN_TITLES,
    DIRECTOR_TITLES,
} = require('../models/constants')

const getAllUWFinancePurchases = (_, res) => {
    getAnnotatedUWFinancePurchasesByIdList()
        .then((uwFinancePurchases) => res.json(uwFinancePurchases))
        .catch((err) => res.status(400).json('Error: ' + err))
}

const getUWFinancePurchase = (req, res) => {
    getAnnotatedUWFinancePurchasesByIdList([req.params.id])
        .then((uwFinancePurchases) => res.json(uwFinancePurchases[0]))
        .catch((err) => res.status(400).json('Error: ' + err))
}

const createNewUWFinancePurchase = async (req, res) => {
    const newUWFinancePurchase = new UWFinancePurchase(req.body)
    try {
        const newUPR = await newUWFinancePurchase.save()
        await FundingItem.findByIdAndUpdate(newUPR.fi_link, {
            $push: { upr_links: newUPR._id },
        })
        res.json(newUPR)
    } catch (err) {
        res.status(400).json('Error: ' + err)
    }
}

const updateUWFinancePurchase = (req, res) => {
    UWFinancePurchase.findByIdAndUpdate(req.params.id, req.body)
        .then(() => res.json(req.body))
        .catch((err) => res.status(400).json('Error: ' + err))
}

const updateApprovalsUWFinancePurchase = async (req, res) => {
    const { ticket_data, approval_type, identifier } = req.body

    const currentGoogleGroup = await getGoogleGroup(identifier)

    const isAdmin = ADMIN_IDENTIFIERS.includes(identifier)
    const isTeamCaptain =
        isAdmin || TEAM_CAPTAIN_TITLES.includes(currentGoogleGroup.title)
    const isDirector =
        isTeamCaptain || DIRECTOR_TITLES.includes(currentGoogleGroup.title)

    const canUpdateApproval =
        (approval_type === APPROVAL_LEVELS.admin_approval && isAdmin) ||
        (approval_type === APPROVAL_LEVELS.team_captain_approval &&
            isTeamCaptain) ||
        (approval_type === APPROVAL_LEVELS.director_approval && isDirector)

    // TODO: If this is the last approval, transition status to 'SENT_TO_COORDINATOR' and auto send email

    if (canUpdateApproval) {
        UWFinancePurchase.findByIdAndUpdate(req.params.id, ticket_data)
            .then(() => res.json(req.body))
            .catch((err) => res.status(400).json('Error: ' + err))
    } else {
        res.status(403).json('Error: Permission Denied')
    }
}

const deleteUWFinancePurchase = async (req, res) => {
    try {
        const UPRid = req.params.id
        const UPRtoDelete = await UWFinancePurchase.findById(UPRid)
        await FundingItem.findByIdAndUpdate(UPRtoDelete.fi_link, {
            $pull: { upr_links: UPRid },
        })
        const deleted = await UPRtoDelete.remove()
        res.json(deleted)
    } catch (err) {
        res.status(400).json('Error: ' + err)
    }
}

const getSponsorshipFund = async (req, res) => {
    const uwFinancePurchase = await UWFinancePurchase.findById(req.params.id)
    const fundingItem = await FundingItem.findById(uwFinancePurchase?.fi_link)
    getAnnotatedSponsorshipFundsByIdList([fundingItem?.sf_link])
        .then((sponsorshipFunds) => {
            res.json(sponsorshipFunds[0])
        })
        .catch((err) => res.status(400).json('Error: ' + err))
}

module.exports = {
    getAllUWFinancePurchases,
    getUWFinancePurchase,
    createNewUWFinancePurchase,
    updateUWFinancePurchase,
    updateApprovalsUWFinancePurchase,
    deleteUWFinancePurchase,
    getSponsorshipFund,
}
