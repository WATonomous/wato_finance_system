const UWFinancePurchase = require('../models/uwfinancepurchase.model')
const FundingItem = require('../models/fundingitem.model')
const {
    getAnnotatedSponsorshipFundsByIdList,
    getAnnotatedUWFinancePurchasesByIdList,
} = require('./annotatedGetters')

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
    return annotatedUPR
}

const updateUWFinancePurchase = (id, body) => {
    return UWFinancePurchase.findByIdAndUpdate(id, body, {
        new: true,
    })
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

const updateApprovalsUWFinancePurchase = async (id, ticket_data) => {
    const newUWFinancePurchase = await UWFinancePurchase.findByIdAndUpdate(
        id,
        ticket_data,
        {
            new: true,
        }
    )
    const completedApprovals =
        newUWFinancePurchase.team_captain_approval &&
        newUWFinancePurchase.admin_approval &&
        newUWFinancePurchase.director_approval

    if (completedApprovals) {
        return UWFinancePurchase.findByIdAndUpdate(
            id,
            {
                status: 'SENT_TO_COORDINATOR',
            },
            {
                new: true,
            }
        )
    }

    // TODO: If this is the last approval, transition status to 'SENT_TO_COORDINATOR' and auto send email

    return newUWFinancePurchase
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
