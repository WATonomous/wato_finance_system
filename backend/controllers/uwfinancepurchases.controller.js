const FundingItem = require('../models/fundingitem.model')
const UWFinancePurchase = require('../models/uwfinancepurchase.model')
const {
    getAnnotatedSponsorshipFundsByIdList,
} = require('./sponsorshipfunds.controller')

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

const getAllUWFinancePurchases = (_, res) => {
    getAnnotatedUWFinancePurchasesByIdList()
        .then((uwFinancePurchases) => res.json(uwFinancePurchases))
        .catch((err) => res.status(400).json('Error: ' + err))
}

const getUWFinancePurchase = (req, res) => {
    getAnnotatedUWFinancePurchasesByIdList([req.params.id])
        .then((uwFinancePurchases) => res.json(uwFinancePurchases[0]))
        .catch((err) => res.status(400).json('Error: ' + err))
}

const createNewUWFinancePurchase = async (req, res) => {
    const newUWFinancePurchase = new UWFinancePurchase(req.body)
    try {
        const newUPR = await newUWFinancePurchase.save()
        await FundingItem.findByIdAndUpdate(newUPR.fi_link, {
            $push: { upr_links: newUPR._id },
        })
        res.json(newUPR)
    } catch (err) {
        res.status(400).json('Error: ' + err)
    }
}

const updateUWFinancePurchase = (req, res) => {
    UWFinancePurchase.findByIdAndUpdate(req.params.id, req.body)
        .then(() => res.json(req.body))
        .catch((err) => res.status(400).json('Error: ' + err))
}

const deleteUWFinancePurchase = async (req, res) => {
    try {
        const UPRid = req.params.id
        const UPRtoDelete = await UWFinancePurchase.findById(UPRid)
        await FundingItem.findByIdAndUpdate(UPRtoDelete.fi_link, {
            $pull: { upr_links: UPRid },
        })
        const deleted = await UPRtoDelete.remove()
        res.json(deleted)
    } catch (err) {
        res.status(400).json('Error: ' + err)
    }
}

const getSponsorshipFund = async (req, res) => {
    const uwFinancePurchase = await UWFinancePurchase.findById(req.params.id)
    const fundingItem = await FundingItem.findById(uwFinancePurchase?.fi_link)
    getAnnotatedSponsorshipFundsByIdList([fundingItem?.sf_link])
        .then((sponsorshipFunds) => {
            res.json(sponsorshipFunds[0])
        })
        .catch((err) => res.status(400).json('Error: ' + err))
}

module.exports = {
    getAnnotatedUWFinancePurchasesByIdList,
    getAllUWFinancePurchases,
    getUWFinancePurchase,
    createNewUWFinancePurchase,
    updateUWFinancePurchase,
    deleteUWFinancePurchase,
    getSponsorshipFund,
}
