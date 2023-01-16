const PersonalPurchase = require('../models/personalpurchase.model')
const FundingItem = require('../models/fundingitem.model')
const {
    getAnnotatedSponsorshipFundsByIdList,
} = require('./sponsorshipfunds.controller')

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

const getAllPersonalPurchases = (_, res) => {
    getAnnotatedPersonalPurchasesByIdList()
        .then((personalPurchases) => res.json(personalPurchases))
        .catch((err) => res.status(400).json('Error: ' + err))
}

const getPersonalPurchase = (req, res) => {
    getAnnotatedPersonalPurchasesByIdList([req.params.id])
        .then((personalPurchases) => res.json(personalPurchases[0]))
        .catch((err) => res.status(400).json('Error: ' + err))
}

const createPersonalPurchase = async (req, res) => {
    const newPersonalPurchase = new PersonalPurchase(req.body)
    try {
        const newPPR = await newPersonalPurchase.save()
        await FundingItem.findByIdAndUpdate(newPPR.fi_link, {
            $push: { ppr_links: newPPR._id },
        })
        res.json(newPPR)
    } catch (err) {
        res.status(400).json('Error: ' + err)
    }
}

const updatePersonalPurchase = (req, res) => {
    PersonalPurchase.findByIdAndUpdate(req.params.id, req.body)
        .then(() => res.json(req.body))
        .catch((err) => res.status(400).json('Error: ' + err))
}

const deletePersonalPurchase = async (req, res) => {
    try {
        const PPRid = req.params.id
        const PPRtoDelete = await PersonalPurchase.findById(PPRid)
        await FundingItem.findByIdAndUpdate(PPRtoDelete.fi_link, {
            $pull: { ppr_links: PPRid },
        })
        const deleted = await PPRtoDelete.remove()
        res.json(deleted)
    } catch (err) {
        res.status(400).json('Error: ' + err)
    }
}

const getSponsorshipFund = async (req, res) => {
    const personalPurchase = await PersonalPurchase.findById(req.params.id)
    const fundingItem = await FundingItem.findById(personalPurchase.fi_link)
    getAnnotatedSponsorshipFundsByIdList([fundingItem?.sf_link])
        .then((sponsorshipFunds) => {
            res.json(sponsorshipFunds[0])
        })
        .catch((err) => res.status(400).json('Error: ' + err))
}

module.exports = {
    getAnnotatedPersonalPurchasesByIdList,
    getAllPersonalPurchases,
    getPersonalPurchase,
    createPersonalPurchase,
    updatePersonalPurchase,
    deletePersonalPurchase,
    getSponsorshipFund,
}
