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
        const newFI = await newFundingItem.save()
        // update the parent to store link to child funding item
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
        const FIid = req.params.id
        const FItoDelete = await FundingItem.findById(FIid)
        await SponsorshipFund.findByIdAndUpdate(FItoDelete.sf_link, {
            $pull: { fi_links: FIid },
        })
        await FItoDelete.remove()
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
