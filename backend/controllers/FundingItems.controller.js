let FundingItem = require('../models/FundingItem.model')

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

const createFundingItem = (req, res) => {
    const { body } = req
    const newFundingItem = new FundingItem(body)

    newFundingItem
        .save()
        .then(() => res.json(newFundingItem))
        .catch((err) => res.status(400).json('Error: ' + err))
}

const updateFundingItem = (req, res) => {
    FundingItem.findByIdAndUpdate(req.params.id, req.body)
        .then(() => res.json(req.body))
        .catch((err) => res.status(400).json('Error: ' + err))
}

const deleteFundingItem = (req, res) => {
    FundingItem.findByIdAndDelete(req.params.id)
        .then(() => res.json('FundingItem deleted.'))
        .catch((err) => res.status(400).json('Error: ' + err))
}

module.exports = {
    getAllFundingItems,
    getFundingItem,
    createFundingItem,
    updateFundingItem,
    deleteFundingItem,
}
