const SponsorshipFund = require('../models/sponsorshipfund.model')
const {
    cascadeDeleteFundingItem,
    getAnnotatedFundingItemsByIdList,
} = require('./fundingitems.controller')
const {
    getAnnotatedPersonalPurchasesByIdList,
} = require('./personalpurchases.controller')
const {
    getAnnotatedUWFinancePurchasesByIdList,
} = require('./uwfinancepurchases.controller')

// empty list arg queries for all Sponsorship Funds
const getAnnotatedSponsorshipFundsByIdList = async (idList = []) => {
    if (idList.length === 0) {
        idList = await SponsorshipFund.distinct('_id')
    }
    const sponsorshipFundList = await Promise.all(
        idList.map(async (id) => {
            const sponsorshipFund = await SponsorshipFund.findById(id)
            let fundingSpent = 0
            if (sponsorshipFund.fi_links.length > 0) {
                const fundingItemList = await getAnnotatedFundingItemsByIdList(
                    sponsorshipFund.fi_links
                )
                fundingSpent = fundingItemList
                    .map((fundingItem) => fundingItem.funding_spent)
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
                        path: {
                            $concat: ['/SF/', { $toString: '$_id' }],
                        },
                        funding_spent: fundingSpent,
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

const getAllSponsorshipFunds = (_, res) => {
    getAnnotatedSponsorshipFundsByIdList()
        .then((sponsorshipFunds) => {
            res.json(sponsorshipFunds)
        })
        .catch((err) => res.status(400).json(err))
}

const getSponsorshipFund = (req, res) => {
    const { id } = req.params
    getAnnotatedSponsorshipFundsByIdList([id])
        .then((sponsorshipFunds) => {
            res.json(sponsorshipFunds[0])
        })
        .catch((err) => res.status(400).json(err))
}

// this function reaches all the way down to the children
const getAllChildren = async (req, res) => {
    const { id } = req.params

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
    res.json({ ...sponsorshipFund, fundingItems: allSFChildren })
}

const createSponsorshipFund = (req, res) => {
    const { body } = req
    const newSponsorshipFund = new SponsorshipFund(body)

    newSponsorshipFund
        .save()
        .then(() => res.json(newSponsorshipFund))
        .catch((err) => res.status(400).json('Error: ' + err))
}

const updateSponsorshipFund = async (req, res) => {
    const { id } = req.params
    const updatedFields = req.body
    try {
        const updated = await SponsorshipFund.findByIdAndUpdate(
            id,
            updatedFields,
            {
                new: true,
            }
        )
        res.json(updated)
    } catch (err) {
        res.status(400).json('Error: ' + err)
    }
}

const deleteSponsorshipFund = async (req, res) => {
    const { id } = req.params
    try {
        const SFToDelete = await SponsorshipFund.findById(id)
        const { fi_links } = SFToDelete
        await Promise.all(
            fi_links.map(async (fi_id) => {
                return cascadeDeleteFundingItem(fi_id)
            })
        )
        const deleted = await SFToDelete.remove()
        res.json(deleted)
    } catch (err) {
        res.status(400).json('Error: ' + err)
    }
}

module.exports = {
    getAnnotatedSponsorshipFundsByIdList,
    getAllSponsorshipFunds,
    createSponsorshipFund,
    getSponsorshipFund,
    updateSponsorshipFund,
    deleteSponsorshipFund,
    getAllChildren,
}
