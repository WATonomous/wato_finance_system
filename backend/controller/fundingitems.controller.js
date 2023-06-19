const SponsorshipFund = require('../models/sponsorshipfund.model')
const {
    getAllFundingItems,
    getFundingItem,
    createFundingItem,
    updateFundingItem,
    updateSFLinkFundingItem,
    deleteFundingItem,
} = require('../service/fundingitems.service')

const getAllFundingItemsController = (_, res) => {
    getAllFundingItems()
        .then(async (fundingItems) => {
            res.status(200).json(fundingItems)
        })
        .catch((err) => res.status(500).json('Error: ' + err))
}

const getFundingItemController = (req, res) => {
    getFundingItem(req.params.id)
        .then((fundingItem) => {
            res.status(200).json(fundingItem)
        })
        .catch((err) => res.status(500).json('Error: ' + err))
}

const createFundingItemController = (req, res) => {
    createFundingItem(req.body)
        .then((newFI) => res.status(200).json(newFI))
        .catch((err) => res.status(500).json('Error: ' + err))
}

const updateFundingItemController = (req, res) => {
    if (req.body.sf_link || req.body.ppr_links || req.body.upr_links) {
        res.status(400).json(
            'Error: sf_link, ppr_links, and upr_links in FI cannot be patched'
        )
        return
    }

    updateFundingItem(req.params.id, req.body)
        .then((updatedFI) => res.status(200).json(updatedFI))
        .catch((err) => res.status(500).json('Error: ' + err))
}

const updateSFLinkFundingItemController = async (req, res) => {
    const { sf_link } = req.body
    // TODO: add auth check (director+ and owner should be allowed)
    if (!sf_link) {
        res.status(400).json('Error: patch must include sf_link')
        return
    }

    const newSF = await SponsorshipFund.exists({ _id: sf_link })
    if (!newSF) {
        res.status(400).json('Error: SF with _id of sf_link does not exist')
        return
    }

    updateSFLinkFundingItem(req.params.id, sf_link)
        .then((updatedFI) => res.status(200).json(updatedFI))
        .catch((err) => res.status(500).json('Error: ' + err))
}

const deleteFundingItemController = (req, res) => {
    deleteFundingItem(req.params.id)
        .then((deleted) => res.status(200).json(deleted))
        .catch((err) => res.status(500).json('Error: ' + err))
}

module.exports = {
    getAllFundingItemsController,
    getFundingItemController,
    createFundingItemController,
    updateFundingItemController,
    updateSFLinkFundingItemController,
    deleteFundingItemController,
}
