const SponsorshipFund = require('../models/sponsorshipfund.model')
const FundingItem = require('../models/fundingitem.model')
const PersonalPurchase = require('../models/personalpurchase.model')
const UWFinancePurchase = require('../models/uwfinancepurchase.model')
const Constants = require('../models/constants')

// empty list arg queries for all Sponsorship Funds
const getAnnotatedUWFinancePurchasesByIdList = async (idList = []) => {
    if (idList.length === 0) {
        idList = await UWFinancePurchase.distinct('_id')
    }
    const uwFinancePurchaseList = await Promise.all(
        idList.map(async (id) => {
            return UWFinancePurchase.aggregate([
                {
                    $match: {
                        _id: parseInt(id),
                    },
                },
                {
                    $set: {
                        type: 'UPR',
                        code: {
                            $concat: ['UPR-', { $toString: '$_id' }],
                        },
                        codename: {
                            $concat: [
                                'UPR-',
                                { $toString: '$_id' },
                                ': ',
                                '$name',
                            ],
                        },
                        path: {
                            $concat: ['/UPR/', { $toString: '$_id' }],
                        },
                    },
                },
            ])
        })
    )

    // aggregate returns an array so uwFinancePurchaseList
    // will always be a list of one-elem lists:
    // i.e. [[UPR-1], [UPR-2], ...] where UPR-X is a UWFinancePurchase object
    return uwFinancePurchaseList.flat()
}

// empty list arg queries for all Sponsorship Funds
const getAnnotatedPersonalPurchasesByIdList = async (idList = []) => {
    if (idList.length === 0) {
        idList = await PersonalPurchase.distinct('_id')
    }
    const personalPurchaseList = await Promise.all(
        idList.map(async (id) => {
            return PersonalPurchase.aggregate([
                {
                    $match: {
                        _id: parseInt(id),
                    },
                },
                {
                    $set: {
                        type: 'PPR',
                        code: {
                            $concat: ['PPR-', { $toString: '$_id' }],
                        },
                        codename: {
                            $concat: [
                                'PPR-',
                                { $toString: '$_id' },
                                ': ',
                                '$name',
                            ],
                        },
                        path: {
                            $concat: ['/PPR/', { $toString: '$_id' }],
                        },
                    },
                },
            ])
        })
    )

    // aggregate returns an array so personalPurchaseList
    // will always be a list of one-elem lists:
    // i.e. [[PPR-1], [PPR-2], ...] where UPR-X is a PersonalPurchase object
    return personalPurchaseList.flat()
}

// empty list arg queries for all Funding Items
const getAnnotatedFundingItemsByIdList = async (idList = []) => {
    if (idList.length === 0) {
        idList = await FundingItem.distinct('_id')
    }
    const fundingItemList = await Promise.all(
        idList.map(async (id) =>
            FundingItem.aggregate([
                {
                    $match: {
                        _id: parseInt(id),
                    },
                },
                // load ppr and upr documents as temp variables via links to referenced collection
                {
                    $lookup: {
                        from: 'personalpurchases',
                        localField: 'ppr_links',
                        foreignField: '_id',
                        as: 'ppr_docs',
                    },
                },
                {
                    $lookup: {
                        from: 'uwfinancepurchases',
                        localField: 'upr_links',
                        foreignField: '_id',
                        as: 'upr_docs',
                    },
                },
                // filter documents by status (only include docs that count towards funding_spent)
                {
                    $set: {
                        ppr_docs: {
                            $filter: {
                                input: '$ppr_docs',
                                as: 'ppr_doc',
                                cond: {
                                    $in: [
                                        '$$ppr_doc.status',
                                        Constants.PPR_STATUS_FUNDING_SPENT,
                                    ],
                                },
                            },
                        },
                    },
                },
                {
                    $set: {
                        upr_docs: {
                            $filter: {
                                input: '$upr_docs',
                                as: 'upr_doc',
                                cond: {
                                    $in: [
                                        '$$upr_doc.status',
                                        Constants.UPR_STATUS_FUNDING_SPENT,
                                    ],
                                },
                            },
                        },
                    },
                },
                // filter documents by status (only include docs that count towards amount_reimbursed)
                {
                    $set: {
                        ppr_docs_reimbursed: {
                            $filter: {
                                input: '$ppr_docs',
                                as: 'ppr_doc',
                                cond: {
                                    $eq: ['$$ppr_doc.status', 'REIMBURSED'],
                                },
                            },
                        },
                    },
                },
                {
                    $set: {
                        upr_docs_reimbursed: {
                            $filter: {
                                input: '$upr_docs',
                                as: 'upr_doc',
                                cond: {
                                    $eq: ['$$upr_doc.status', 'REIMBURSED'],
                                },
                            },
                        },
                    },
                },
                {
                    $set: {
                        type: 'FI',
                        code: {
                            $concat: ['FI-', { $toString: '$_id' }],
                        },
                        codename: {
                            $concat: [
                                'FI-',
                                { $toString: '$_id' },
                                ': ',
                                '$name',
                            ],
                        },
                        path: {
                            $concat: ['/FI/', { $toString: '$_id' }],
                        },
                        funding_spent: {
                            $round: [
                                {
                                    $sum: [
                                        {
                                            $sum: '$ppr_docs.cost',
                                        },
                                        {
                                            $sum: '$upr_docs.cost',
                                        },
                                    ],
                                },
                                2,
                            ],
                        },
                        amount_reimbursed: {
                            $round: [
                                {
                                    $sum: [
                                        {
                                            $sum: '$ppr_docs_reimbursed.cost',
                                        },
                                        {
                                            $sum: '$upr_docs_reimbursed.cost',
                                        },
                                    ],
                                },
                                2,
                            ],
                        },
                    },
                },
                {
                    $unset: [
                        'ppr_docs',
                        'upr_docs',
                        'ppr_docs_reimbursed',
                        'upr_docs_reimbursed',
                    ],
                },
            ])
        )
    )

    // aggregate returns an array so fundingItemList
    // will always be a list of one-elem lists:
    // i.e. [[FI-1], [FI-2], ...] where FI-X is a FundingItem object
    return fundingItemList.flat()
}

// empty list arg queries for all Sponsorship Funds
const getAnnotatedSponsorshipFundsByIdList = async (idList = []) => {
    if (idList.length === 0) {
        idList = await SponsorshipFund.distinct('_id')
    }
    const sponsorshipFundList = await Promise.all(
        idList.map(async (id) => {
            const sponsorshipFund = await SponsorshipFund.findById(id)
            let fundingSpent = 0
            let amountReimbursed = 0
            if (sponsorshipFund.fi_links.length > 0) {
                const fundingItemList = await getAnnotatedFundingItemsByIdList(
                    sponsorshipFund.fi_links
                )
                fundingSpent = fundingItemList
                    .map((fundingItem) => fundingItem.funding_spent)
                    .reduce((a, b) => a + b, 0)
                amountReimbursed = fundingItemList
                    .map((fundingItem) => fundingItem.amount_reimbursed)
                    .reduce((a, b) => a + b, 0)
            }
            return SponsorshipFund.aggregate([
                {
                    $match: {
                        _id: parseInt(id),
                    },
                },
                {
                    $set: {
                        type: 'SF',
                        code: {
                            $concat: ['SF-', { $toString: '$_id' }],
                        },
                        codename: {
                            $concat: [
                                'SF-',
                                { $toString: '$_id' },
                                ': ',
                                '$organization',
                                ' - ',
                                '$semester',
                            ],
                        },
                        path: {
                            $concat: ['/SF/', { $toString: '$_id' }],
                        },
                        funding_spent: fundingSpent,
                        amount_reimbursed: amountReimbursed,
                        name: {
                            $concat: ['$organization', ' - ', '$semester'],
                        },
                    },
                },
            ])
        })
    )

    // aggregate returns an array so sponsorshipFundList
    // will always be a list of one-elem lists:
    // i.e. [[SF-1], [SF-2], ...] where SF-X is a SponsorshipFund object
    return sponsorshipFundList.flat()
}

module.exports = {
    getAnnotatedSponsorshipFundsByIdList,
    getAnnotatedFundingItemsByIdList,
    getAnnotatedUWFinancePurchasesByIdList,
    getAnnotatedPersonalPurchasesByIdList,
}
