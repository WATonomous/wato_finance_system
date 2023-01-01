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

const getFundingItemFundingSpentById = async (id) => {
    const fundingSpent = await FundingItem.aggregate([
        {
            $match: {
                _id: id,
            },
        },
        {
            $lookup: {
                from: 'personalpurchases',
                localField: 'ppr_links',
                foreignField: '_id',
                as: 'ppr_links',
            },
        },
        {
            $lookup: {
                from: 'uwfinancepurchases',
                localField: 'upr_links',
                foreignField: '_id',
                as: 'upr_links',
            },
        },
        {
            $project: {
                "_id": 0,
                "funding_spent": {
                    "$round": [{
                        "$sum": [
                            {
                                "$sum": "$ppr_links.cost"
                            },
                            {
                                "$sum": "$upr_links.cost"
                            }
                        ]
                    }, 2]
                },
            }
        },
    ])
    return fundingSpent[0].funding_spent
}


const getSponsorshipFundFundingSpentByFILinks = async (fi_links) => {
    const fundingSpentList = await Promise.all(fi_links.map(async (id) => await getFundingItemFundingSpentById(id)))
    return fundingSpentList.reduce((a, b) => a + b, 0)
}

module.exports = {
    getFundingItemsBySponsorshipFund,
    getPersonalPurchasesByFundingItem,
    getUWFinancePurchasesByFundingItem,
    getFundingItemFundingSpentById,
    getSponsorshipFundFundingSpentByFILinks,
}
