const FundingItem = require('../models/fundingitem.model')
const SponsorshipFund = require('../models/sponsorshipfund.model')

const getAllFundingItems = (_, res) => {
    FundingItem.find()
        .then((fundingItems) => res.json(fundingItems))
        .catch((err) => res.status(400).json('Error: ' + err))
}

const getFundingItem = (req, res) => {
    FundingItem.findById(req.params.id)
        .then((fundingItem) => res.json(fundingItem))
        .catch((err) => res.status(400).json('Error: ' + err))
}

const createFundingItem = async (req, res) => {
    const { body } = req
    const newFundingItem = new FundingItem(body)

    try {
        const savedItem = await newFundingItem.save()
        // update the parent to store link to child funding item
        await SponsorshipFund.findByIdAndUpdate(savedItem.sf_link, {
            $push: { fi_links: savedItem._id },
        })
        res.json(savedItem)
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
        await FundingItem.findByIdAndDelete(req.params.id)
        await SponsorshipFund.findByIdAndUpdate(savedItem.sf_link, {
            $pull: { fi_link: req.params.id },
        })
        res.json('FundingItem deleted.')
    } catch (err) {
        res.status(400).json('Error: ' + err)
    }
}

module.exports = {
    getAllFundingItems,
    getFundingItem,
    createFundingItem,
    updateFundingItem,
    deleteFundingItem,
}
