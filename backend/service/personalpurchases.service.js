const PersonalPurchase = require('../models/personalpurchase.model')
const FundingItem = require('../models/fundingitem.model')
const {
    getAnnotatedPersonalPurchasesByIdList,
    getAnnotatedSponsorshipFundsByIdList,
} = require('./annotatedGetters')
const {
    sendEmailPPRCreatedToApprovers,
    sendEmailPPRApprovedToReporter,
    sendEmailPPRPurchasedAndReceiptsSubmittedToCoordinator,
    sendEmailPPRReimbursedToReporter,
} = require('../emails/emails')

const getAllPersonalPurchases = () => {
    return getAnnotatedPersonalPurchasesByIdList()
}

const getPersonalPurchase = async (id) => {
    const PPR = await getAnnotatedPersonalPurchasesByIdList([id])
    return PPR[0]
}

const createPersonalPurchase = async (body) => {
    const newPPR = new PersonalPurchase(body)
    const savedPPR = await newPPR.save()
    const annotatedPPR = await getPersonalPurchase(savedPPR._id)
    await FundingItem.findByIdAndUpdate(annotatedPPR.fi_link, {
        $push: { ppr_links: annotatedPPR._id },
    })

    await sendEmailPPRCreatedToApprovers(annotatedPPR)
    return annotatedPPR
}

const updatePersonalPurchase = async (id, body) => {
    // READY_TO_BUY -> PURCHASED_AND_RECEIPTS_SUBMITTED
    const newPurchaseTicket = PersonalPurchase.findByIdAndUpdate(id, body, {
        new: true,
    })
    const annotatedPPR = await getPersonalPurchase(id)
    if (body?.status === 'PURCHASED_AND_RECEIPTS_SUBMITTED') {
        await sendEmailPPRPurchasedAndReceiptsSubmittedToCoordinator(annotatedPPR)
    } else if (body?.status === 'REPORTER_PAID') {
        await sendEmailPPRReimbursedToReporter(annotatedPPR)
    }
    return newPurchaseTicket
}

const updateFILinkPersonalPurchase = async (id, new_fi_link) => {
    const { fi_link: old_fi_link } = await getPersonalPurchase(id)
    await FundingItem.findByIdAndUpdate(old_fi_link, {
        $pull: { ppr_links: id },
    })
    await FundingItem.findByIdAndUpdate(new_fi_link, {
        $push: { ppr_links: id },
    })
    return PersonalPurchase.findByIdAndUpdate(
        id,
        { fi_link: new_fi_link },
        {
            new: true,
        }
    )
}

const updateApprovalsPersonalPurchase = async (id, new_approval_levels) => {
    const completedApprovals =
        new_approval_levels.team_captain_approval &&
        new_approval_levels.admin_approval &&
        new_approval_levels.director_approval

    if (completedApprovals) {
        const newPersonalPurchase = await PersonalPurchase.findByIdAndUpdate(
            id,
            {
                ...new_approval_levels,
                status: 'READY_TO_BUY',
            },
            {
                new: true,
            }
        )
        const annotatedPPR = await getPersonalPurchase(id)
        await sendEmailPPRApprovedToReporter(annotatedPPR)
        return newPersonalPurchase
    }

    return PersonalPurchase.findByIdAndUpdate(id, new_approval_levels, {
        new: true,
    })
}

const deletePersonalPurchase = async (id) => {
    const PPRtoDelete = await PersonalPurchase.findById(id)
    await FundingItem.findByIdAndUpdate(PPRtoDelete.fi_link, {
        $pull: { ppr_links: id },
    })
    return PPRtoDelete.remove()
}

const getSponsorshipFundByPPR = async (id) => {
    const personalPurchase = await PersonalPurchase.findById(id)
    const fundingItem = await FundingItem.findById(personalPurchase.fi_link)
    const sponsorshipFunds = await getAnnotatedSponsorshipFundsByIdList([
        fundingItem?.sf_link,
    ])
    return sponsorshipFunds[0]
}

module.exports = {
    getAllPersonalPurchases,
    getPersonalPurchase,
    createPersonalPurchase,
    updatePersonalPurchase,
    updateFILinkPersonalPurchase,
    updateApprovalsPersonalPurchase,
    deletePersonalPurchase,
    getSponsorshipFundByPPR,
}
