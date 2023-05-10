const FundingItem = require('../models/fundingitem.model')
const SponsorshipFund = require('../models/sponsorshipfund.model')
const PersonalPurchase = require('../models/personalpurchase.model')
const UWFinancePurchase = require('../models/uwfinancepurchase.model')
const { getAnnotatedFundingItemsByIdList } = require('./annotatedGetters')

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
