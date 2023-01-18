const FundingItem = require('../models/fundingitem.model')
const SponsorshipFund = require('../models/sponsorshipfund.model')
const PersonalPurchase = require('../models/personalpurchase.model')
const UWFinancePurchase = require('../models/uwfinancepurchase.model')

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
                // map ppr_links and upr_links to documents via referenced collection
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
                        type: 'FI',
                        code: {
                            $concat: ['FI-', { $toString: '$_id' }],
                        },
                        path: {
                            $concat: ['/FI/', { $toString: '$_id' }],
                        },
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
                        // map the documents back to their ids to preserve schema shape
                        upr_links: {
                            $map: {
                                input: '$upr_links',
                                as: 'uprDoc',
                                in: '$$uprDoc._id',
                            },
                        },
                        ppr_links: {
                            $map: {
                                input: '$ppr_links',
                                as: 'pprDoc',
                                in: '$$pprDoc._id',
                            },
                        },
                    },
                },
            ])
        )
    )

    // aggregate returns an array so fundingItemList
    // will always be a list of one-elem lists:
    // i.e. [[FI-1], [FI-2], ...] where FI-X is a FundingItem object
    return fundingItemList.flat()
}

const getAllFundingItems = (_, res) => {
    getAnnotatedFundingItemsByIdList()
        .then(async (fundingItems) => {
            res.json(fundingItems)
        })
        .catch((err) => res.status(400).json('Error: ' + err))
}

const getFundingItem = (req, res) => {
    getAnnotatedFundingItemsByIdList([req.params.id])
        .then((fundingItems) => {
            res.json(fundingItems[0])
        })
        .catch((err) => res.status(400).json('Error: ' + err))
}

const createFundingItem = async (req, res) => {
    const { body } = req
    const newFundingItem = new FundingItem(body)
    try {
        const newFI = await newFundingItem.save()
        // update the parent SF to store link to child FI
        await SponsorshipFund.findByIdAndUpdate(newFI.sf_link, {
            $push: { fi_links: newFI._id },
        })
        res.json(newFI)
    } catch (err) {
        res.status(400).json('Error: ' + err)
    }
}

const updateFundingItem = (req, res) => {
    FundingItem.findByIdAndUpdate(req.params.id, req.body)
        .then(() => res.json(req.body))
        .catch((err) => res.status(400).json('Error: ' + err))
}

const deleteFundingItem = async (req, res) => {
    try {
        const deleted = await cascadeDeleteFundingItem(req.params.id)
        res.json(deleted)
    } catch (err) {
        res.status(400).json('Error: ' + err)
    }
}

const cascadeDeleteFundingItem = async (id) => {
    const FIToDelete = await FundingItem.findById(id)
    const { ppr_links, upr_links } = FIToDelete
    await SponsorshipFund.findByIdAndUpdate(FIToDelete.sf_link, {
        $pull: { fi_links: id },
    })
    await PersonalPurchase.deleteMany({ _id: { $in: ppr_links } })
    await UWFinancePurchase.deleteMany({ _id: { $in: upr_links } })
    return await FIToDelete.remove()
}

module.exports = {
    getAnnotatedFundingItemsByIdList,
    getAllFundingItems,
    getFundingItem,
    createFundingItem,
    updateFundingItem,
    deleteFundingItem,
    cascadeDeleteFundingItem,
}
