const SponsorshipFund = require('./models/sponsorshipfund.model')
const FundingItem = require('./models/fundingitem.model')
const PersonalPurchase = require('./models/personalpurchase.model')
const UWFinancePurchase = require('./models/uwfinancepurchase.model')

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

// empty list arg queries for all Funding Items
const getUpdatedFundingItemsByIdList = async (idList) => {
    if (idList.length === 0) {
        idList = await FundingItem.distinct('_id')
    }
    const fundingItemList = await Promise.all(
        idList.map(
            async (id) =>
                await FundingItem.aggregate([
                    {
                        $match: {
                            _id: parseInt(id),
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
                        $set: {
                            funding_spent: {
                                $round: [
                                    {
                                        $sum: [
                                            {
                                                $sum: '$ppr_links.cost',
                                            },
                                            {
                                                $sum: '$upr_links.cost',
                                            },
                                        ],
                                    },
                                    2,
                                ],
                            },
                            upr_links: {
                                $map: {
                                    input: '$upr_links',
                                    as: 'uprObj',
                                    in: '$$uprObj._id',
                                },
                            },
                            ppr_links: {
                                $map: {
                                    input: '$ppr_links',
                                    as: 'pprObj',
                                    in: '$$pprObj._id',
                                },
                            },
                        },
                    },
                ])
        )
    )

    // aggregate always returns an array so fundingItemList will
    // always be a list of one-elem lists:
    // e.g. [[FI-1], [FI-2], ...] where FI-X is a FundingItem object
    return fundingItemList.flat()
}

// empty list arg queries for all Sponsorship Funds
const getUpdatedSponsorshipFundsByIdList = async (idList) => {
    if (idList.length === 0) {
        idList = await SponsorshipFund.distinct('_id')
    }
    const sponsorshipFundList = await Promise.all(
        idList.map(async (id) => {
            const sponsorshipFund = await SponsorshipFund.findById(id)
            let fundingSpent = 0
            if (sponsorshipFund.fi_links.length > 0) {
                const fundingItemList = await getUpdatedFundingItemsByIdList(
                    sponsorshipFund.fi_links
                )
                fundingSpent = fundingItemList
                    .map((fundingItem) => fundingItem.funding_spent)
                    .reduce((a, b) => a + b, 0)
            }
            return await SponsorshipFund.aggregate([
                {
                    $match: {
                        _id: parseInt(id),
                    },
                },
                {
                    $set: {
                        funding_spent: fundingSpent,
                        name: {
                            $concat: ['$organization', ' - ', '$semester'],
                        },
                    },
                },
            ])
        })
    )

    // aggregate always returns an array so sponsorshipFundList will
    // always be a list of one-elem lists:
    // e.g. [[SF-1], [SF-2], ...] where SF-X is a SponsorshipFund object
    return sponsorshipFundList.flat()
}

module.exports = {
    getPersonalPurchasesByFundingItem,
    getUWFinancePurchasesByFundingItem,
    getUpdatedFundingItemsByIdList,
    getUpdatedSponsorshipFundsByIdList,
}
