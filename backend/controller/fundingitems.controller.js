const {
    getAllFundingItems,
    getFundingItem,
    createFundingItem,
    updateFundingItem,
    deleteFundingItem,
} = require('../service/fundingitems.service')

const getAllFundingItemsController = (_, res) => {
    getAllFundingItems()
        .then(async (fundingItems) => {
            res.json(fundingItems)
        })
        .catch((err) => res.status(400).json('Error: ' + err))
}

const getFundingItemController = (req, res) => {
    getFundingItem(req.params.id)
        .then((fundingItem) => {
            res.json(fundingItem)
        })
        .catch((err) => res.status(400).json('Error: ' + err))
}

const createFundingItemController = async (req, res) => {
    createFundingItem(req.body)
        .then((newFI) => res.json(newFI))
        .catch((err) => res.status(400).json('Error: ' + err))
}

const updateFundingItemController = (req, res) => {
    updateFundingItem(req.params.id, req.body)
        .then(() => res.json(req.body))
        .catch((err) => res.status(400).json('Error: ' + err))
}

const deleteFundingItemController = async (req, res) => {
    deleteFundingItem(req.params.id)
        .then((deleted) => res.json(deleted))
        .catch((err) => res.status(400).json('Error: ' + err))
}

module.exports = {
    getAllFundingItemsController,
    getFundingItemController,
    createFundingItemController,
    updateFundingItemController,
    deleteFundingItemController,
}
