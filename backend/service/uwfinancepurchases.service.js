const UWFinancePurchase = require('../models/uwfinancepurchase.model')
const FundingItem = require('../models/fundingitem.model')
const {
    getAnnotatedSponsorshipFundsByIdList,
    getAnnotatedUWFinancePurchasesByIdList,
} = require('./annotatedGetters')
const {
    sendEmailUPRCreatedToApprovers,
    sendEmailUPRApprovedToCoordinator,
    sendEmailUPRPurchasedToCoordinator,
    sendEmailUPRPurchasedToReporter,
    sendEmailUPRReadyForPickupToReporter,
    sendEmailUPRPickedUpToAdmin,
} = require('../emails/emails')

const getAllUWFinancePurchases = () => {
    return getAnnotatedUWFinancePurchasesByIdList()
}

const getUWFinancePurchase = async (id) => {
    const UPR = await getAnnotatedUWFinancePurchasesByIdList([id])
    return UPR[0]
}

const createNewUWFinancePurchase = async (body) => {
    const newUPR = new UWFinancePurchase(body)
    const savedUPR = await newUPR.save()
    const annotatedUPR = await getUWFinancePurchase(savedUPR._id)
    await FundingItem.findByIdAndUpdate(annotatedUPR.fi_link, {
        $push: { upr_links: annotatedUPR._id },
    })

    await sendEmailUPRCreatedToApprovers(annotatedUPR)
    return annotatedUPR
}

const updateUWFinancePurchase = async (id, body) => {
    const newPurchaseTicket = await UWFinancePurchase.findByIdAndUpdate(
        id,
        body,
        {
            new: true,
        }
    )
    // SENT_TO_COORDINATOR -> ORDERED
    if (body.status === 'ORDERED') {
        const annotatedUPR = await getUWFinancePurchase(id)
        const emails = [
            sendEmailUPRPurchasedToCoordinator(annotatedUPR),
            sendEmailUPRPurchasedToReporter(annotatedUPR),
        ]
        await Promise.all(emails)
    }
    // ORDERED -> READY_FOR_PICKUP
    if (body.status === 'READY_FOR_PICKUP') {
        const annotatedUPR = await getUWFinancePurchase(id)
        await sendEmailUPRReadyForPickupToReporter(annotatedUPR)
    }
    // READY_FOR_PICKUP -> PICKED_UP
    if (body.status === 'PICKED_UP') {
        const annotatedUPR = await getUWFinancePurchase(id)
        await sendEmailUPRPickedUpToAdmin(annotatedUPR)
    }
    return newPurchaseTicket
}

const updateFILinkUWFinancePurchase = async (id, new_fi_link) => {
    const { fi_link: old_fi_link } = await getUWFinancePurchase(id)
    await FundingItem.findByIdAndUpdate(old_fi_link, {
        $pull: { upr_links: id },
    })
    await FundingItem.findByIdAndUpdate(new_fi_link, {
        $push: { upr_links: id },
    })
    return UWFinancePurchase.findByIdAndUpdate(
        id,
        { fi_link: new_fi_link },
        {
            new: true,
        }
    )
}

const updateApprovalsUWFinancePurchase = async (id, new_approval_levels) => {
    const completedApprovals =
        new_approval_levels.admin_approval &&
        new_approval_levels.faculty_advisor_approval

    if (completedApprovals) {
        const newUWFinancePurchase = await UWFinancePurchase.findByIdAndUpdate(
            id,
            {
                ...new_approval_levels,
                status: 'SENT_TO_COORDINATOR',
            },
            {
                new: true,
            }
        )
        const annotatedUPR = await getUWFinancePurchase(id)
        await sendEmailUPRApprovedToCoordinator(annotatedUPR)
        return newUWFinancePurchase
    }

    return UWFinancePurchase.findByIdAndUpdate(id, new_approval_levels, {
        new: true,
    })
}

const deleteUWFinancePurchase = async (id) => {
    const UPRtoDelete = await UWFinancePurchase.findById(id)
    await FundingItem.findByIdAndUpdate(UPRtoDelete.fi_link, {
        $pull: { upr_links: id },
    })
    return UPRtoDelete.remove()
}

const getSponsorshipFundByUPR = async (id) => {
    const uwFinancePurchase = await UWFinancePurchase.findById(id)
    const fundingItem = await FundingItem.findById(uwFinancePurchase?.fi_link)
    const sponsorshipFunds = await getAnnotatedSponsorshipFundsByIdList([
        fundingItem?.sf_link,
    ])
    return sponsorshipFunds[0]
}

module.exports = {
    getAllUWFinancePurchases,
    getUWFinancePurchase,
    createNewUWFinancePurchase,
    updateUWFinancePurchase,
    updateFILinkUWFinancePurchase,
    updateApprovalsUWFinancePurchase,
    deleteUWFinancePurchase,
    getSponsorshipFundByUPR,
}
