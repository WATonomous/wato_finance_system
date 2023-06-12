const PersonalPurchase = require('../models/personalpurchase.model')
const FundingItem = require('../models/fundingitem.model')
const {
    getAnnotatedPersonalPurchasesByIdList,
    getAnnotatedSponsorshipFundsByIdList,
} = require('./annotatedGetters')

const getAllPersonalPurchases = () => {
    return getAnnotatedPersonalPurchasesByIdList()
}

const getPersonalPurchase = (id) => {
    return getAnnotatedPersonalPurchasesByIdList([id])
}

const createPersonalPurchase = async (body) => {
    const newPersonalPurchase = new PersonalPurchase(body)
    const newPPR = await newPersonalPurchase.save()
    return FundingItem.findByIdAndUpdate(
        newPPR.fi_link,
        {
            $push: { ppr_links: newPPR._id },
        },
        {
            new: true,
        }
    )
}

const updatePersonalPurchase = (id, body) => {
    return PersonalPurchase.findByIdAndUpdate(id, body, {
        new: true,
    })
}

const updateApprovalsPersonalPurchase = (ticket_data) => {
    const personalPurchase = PersonalPurchase.findByIdAndUpdate(
        req.params.id,
        ticket_data,
        {
            new: true,
        }
    )
    const completedApprovals =
        personalPurchase.team_captain_approval &&
        personalPurchase.admin_approval &&
        personalPurchase.director_approval

    if (completedApprovals) {
        return personalPurchase.findByIdAndUpdate(
            req.params.id,
            {
                status: 'READY_TO_BUY',
            },
            {
                new: true,
            }
        )
    }

    // TODO: Transition status to 'SENT_TO_COORDINATOR' and auto send email
    return personalPurchase
}

const deletePersonalPurchase = async (id) => {
    const PPRtoDelete = await PersonalPurchase.findById(id)
    await FundingItem.findByIdAndUpdate(PPRtoDelete.fi_link, {
        $pull: { ppr_links: PPRid },
    })
    return PPRtoDelete.remove()
}

const getSponsorshipFund = async (id) => {
    const personalPurchase = await PersonalPurchase.findById(id)
    const fundingItem = await FundingItem.findById(personalPurchase.fi_link)
    getAnnotatedSponsorshipFundsByIdList([fundingItem?.sf_link]).then(
        (sponsorshipFunds) => {
            return sponsorshipFunds[0]
        }
    )
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
