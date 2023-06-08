const PersonalPurchase = require('../models/personalpurchase.model')
const FundingItem = require('../models/fundingitem.model')
const {
    getAnnotatedPersonalPurchasesByIdList,
    getAnnotatedSponsorshipFundsByIdList,
} = require('./annotatedGetters')
const { APPROVAL_LEVELS } = require('../models/constants')
const { getAuthRoles } = require('./getAuthRoles')

const getAllPersonalPurchases = (_, res) => {
    getAnnotatedPersonalPurchasesByIdList()
        .then((personalPurchases) => res.json(personalPurchases))
        .catch((err) => res.status(400).json('Error: ' + err))
}

const getPersonalPurchase = (req, res) => {
    getAnnotatedPersonalPurchasesByIdList([req.params.id])
        .then((personalPurchases) => res.json(personalPurchases[0]))
        .catch((err) => res.status(400).json('Error: ' + err))
}

const createPersonalPurchase = async (req, res) => {
    const newPersonalPurchase = new PersonalPurchase(req.body)
    try {
        const newPPR = await newPersonalPurchase.save()
        await FundingItem.findByIdAndUpdate(newPPR.fi_link, {
            $push: { ppr_links: newPPR._id },
        })
        res.json(newPPR)
    } catch (err) {
        res.status(400).json('Error: ' + err)
    }
}

const updatePersonalPurchase = (req, res) => {
    PersonalPurchase.findByIdAndUpdate(req.params.id, req.body)
        .then(() => res.json(req.body))
        .catch((err) => res.status(400).json('Error: ' + err))
}

const updateApprovalsPersonalPurchase = async (req, res) => {
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
    const personalPurchase = PersonalPurchase.findByIdAndUpdate(
        req.params.id,
        ticket_data
    )
    const completedApprovals =
        personalPurchase.team_captain_approval &&
        personalPurchase.admin_approval &&
        personalPurchase.director_approval

    if (completedApprovals) {
        personalPurchase.findByIdAndUpdate(req.params.id, {
            status: 'READY_TO_BUY',
        })
    }
    res.json(req.body)
}

const deletePersonalPurchase = async (req, res) => {
    try {
        const PPRid = req.params.id
        const PPRtoDelete = await PersonalPurchase.findById(PPRid)
        await FundingItem.findByIdAndUpdate(PPRtoDelete.fi_link, {
            $pull: { ppr_links: PPRid },
        })
        const deleted = await PPRtoDelete.remove()
        res.json(deleted)
    } catch (err) {
        res.status(400).json('Error: ' + err)
    }
}

const getSponsorshipFund = async (req, res) => {
    const personalPurchase = await PersonalPurchase.findById(req.params.id)
    const fundingItem = await FundingItem.findById(personalPurchase.fi_link)
    getAnnotatedSponsorshipFundsByIdList([fundingItem?.sf_link])
        .then((sponsorshipFunds) => {
            res.json(sponsorshipFunds[0])
        })
        .catch((err) => res.status(400).json('Error: ' + err))
}

module.exports = {
    getAllPersonalPurchases,
    getPersonalPurchase,
    createPersonalPurchase,
    updatePersonalPurchase,
    updateApprovalsPersonalPurchase,
    deletePersonalPurchase,
    getSponsorshipFund,
}
