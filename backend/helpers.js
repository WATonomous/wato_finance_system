const SponsorshipFund = require('./models/sponsorshipfund.model')
const FundingItem = require('./models/fundingitem.model')
const PersonalPurchase = require('./models/personalpurchase.model')
const UWFinancePurchase = require('./models/uwfinancepurchase.model')

const getFundingItemsBySponsorshipFund = async (sponsorship_id) => {
    const fund = await SponsorshipFund.findById(sponsorship_id)
    return FundingItem.find({
        _id: {
            $in: fund.fi_links,
        },
    })
}

const getPersonalPurchasesByFundingItem = async (funding_item_id) => {
    const fundingItem = await FundingItem.findById(funding_item_id)
    return PersonalPurchase.find({
        _id: {
            $in: fundingItem.ppr_links,
        },
    })
}

const getUWFinancePurchasesByFundingItem = async (funding_item_id) => {
    const fundingItem = await FundingItem.findById(funding_item_id)
    return UWFinancePurchase.find({
        _id: {
            $in: fundingItem.upr_links,
        },
    })
}

module.exports = {
    getFundingItemsBySponsorshipFund,
    getPersonalPurchasesByFundingItem,
    getUWFinancePurchasesByFundingItem
}
