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
    const newUWFinancePurchase = new UWFinancePurchase(body)
    const newUPR = await newUWFinancePurchase.save()
    return FundingItem.findByIdAndUpdate(
        newUPR.fi_link,
        {
            $push: { upr_links: newUPR._id },
        },
        {
            new: true,
        }
    )
}

const updateUWFinancePurchase = (id, body) => {
    return UWFinancePurchase.findByIdAndUpdate(id, body, {
        new: true,
    })
}

const updateApprovalsUWFinancePurchase = (id, ticket_data) => {
    const newUWFinancePurchase = UWFinancePurchase.findByIdAndUpdate(
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
                status: 'READY_TO_BUY',
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
    updateApprovalsUWFinancePurchase,
    deleteUWFinancePurchase,
    getSponsorshipFundByUPR,
}
