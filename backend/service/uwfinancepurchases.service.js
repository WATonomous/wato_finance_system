const UWFinancePurchase = require('../models/uwfinancepurchase.model')
const FundingItem = require('../models/fundingitem.model')
const {
    getAnnotatedSponsorshipFundsByIdList,
    getAnnotatedUWFinancePurchasesByIdList,
} = require('./annotatedGetters')

const getAllUWFinancePurchases = () => {
    return getAnnotatedUWFinancePurchasesByIdList()
}

const getUWFinancePurchase = (id) => {
    return getAnnotatedUWFinancePurchasesByIdList([id])[0]
}

const createNewUWFinancePurchase = async (body) => {
    const newUWFinancePurchase = new UWFinancePurchase(body)
    const newUPR = await newUWFinancePurchase.save()
    return await FundingItem.findByIdAndUpdate(newUPR.fi_link, {
        $push: { upr_links: newUPR._id },
    })
}

const updateUWFinancePurchase = (id, body) => {
    return UWFinancePurchase.findByIdAndUpdate(id, body)
}

const updateApprovalsUWFinancePurchase = async (ticket_data) => {
    const newUWFinancePurchase = UWFinancePurchase.findByIdAndUpdate(
        req.params.id,
        ticket_data
    )
    const completedApprovals =
        newUWFinancePurchase.team_captain_approval &&
        newUWFinancePurchase.admin_approval &&
        newUWFinancePurchase.director_approval

    if (completedApprovals) {
        return UWFinancePurchase.findByIdAndUpdate(req.params.id, {
            status: 'READY_TO_BUY',
        })
    }

    // TODO: If this is the last approval, transition status to 'SENT_TO_COORDINATOR' and auto send email

    return UWFinancePurchase.findByIdAndUpdate(req.params.id, ticket_data)
}

const deleteUWFinancePurchase = async (id) => {
    const UPRtoDelete = await UWFinancePurchase.findById(id)
    await FundingItem.findByIdAndUpdate(UPRtoDelete.fi_link, {
        $pull: { upr_links: id },
    })
    return await UPRtoDelete.remove()
}

const getSponsorshipFund = async (id) => {
    const uwFinancePurchase = await UWFinancePurchase.findById(id)
    const fundingItem = await FundingItem.findById(uwFinancePurchase?.fi_link)
    return await getAnnotatedSponsorshipFundsByIdList([fundingItem?.sf_link])[0]
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
