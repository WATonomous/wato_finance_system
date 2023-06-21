const SponsorshipFund = require('../models/sponsorshipfund.model')
const { cascadeDeleteFundingItem } = require('./fundingitems.service')
const {
    getAnnotatedFundingItemsByIdList,
    getAnnotatedPersonalPurchasesByIdList,
    getAnnotatedUWFinancePurchasesByIdList,
    getAnnotatedSponsorshipFundsByIdList,
} = require('./annotatedGetters')

const getAllSponsorshipFunds = () => {
    return getAnnotatedSponsorshipFundsByIdList()
}

const getSponsorshipFund = async (id) => {
    const SF = await getAnnotatedSponsorshipFundsByIdList([id])
    return SF[0]
}

// this function reaches all the way down to the children
const getAllChildren = async (id) => {
    const sponsorshipFunds = await getAnnotatedSponsorshipFundsByIdList([id])
    const sponsorshipFund = sponsorshipFunds[0]
    const fundingItems = await getAnnotatedFundingItemsByIdList(
        sponsorshipFund.fi_links
    )
    const allSFChildren = await Promise.all(
        fundingItems.map(async (fundingItem) => {
            const personalPurchases =
                await getAnnotatedPersonalPurchasesByIdList(
                    fundingItem.ppr_links
                )
            const uwFinancePurchases =
                await getAnnotatedUWFinancePurchasesByIdList(
                    fundingItem.upr_links
                )
            return {
                ...fundingItem,
                personalPurchases,
                uwFinancePurchases,
            }
        })
    )
    return { ...sponsorshipFund, fundingItems: allSFChildren }
}

const createSponsorshipFund = (body) => {
    const newSponsorshipFund = new SponsorshipFund(body)

    return newSponsorshipFund.save()
}

const updateSponsorshipFund = (id, body) => {
    return SponsorshipFund.findByIdAndUpdate(id, body, {
        new: true,
    })
}

const deleteSponsorshipFund = async (id) => {
    const SFToDelete = await SponsorshipFund.findById(id)
    const { fi_links } = SFToDelete
    await Promise.all(
        fi_links.map(async (fi_id) => {
            return cascadeDeleteFundingItem(fi_id)
        })
    )
    return SFToDelete.remove()
}

module.exports = {
    getAllSponsorshipFunds,
    createSponsorshipFund,
    getSponsorshipFund,
    updateSponsorshipFund,
    deleteSponsorshipFund,
    getAllChildren,
}
