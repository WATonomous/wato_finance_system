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
    if (!req.isDirector && !req.isReporter) {
        res.status(403).json('Error: Must be Director+ or reporter to update')
        return
    }

    if (req.body.sf_link || req.body.ppr_links || req.body.upr_links) {
        res.status(400).json(
            'Error: ppr_links and upr_links in FI cannot be patched. sf_link must be patched via /update_sf_link'
        )
        return
    }

    updateFundingItem(req.params.id, req.body)
        .then((updatedFI) => res.status(200).json(updatedFI))
        .catch((err) => res.status(500).json('Error: ' + err))
}

const updateSFLinkFundingItemController = async (req, res) => {
    if (!req.isDirector && !req.isReporter) {
        res.status(403).json('Error: Must be Director+ or reporter to update')
        return
    }

    const { sf_link } = req.params

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
    if (!req.isDirector && !req.isReporter) {
        res.status(403).json('Error: Must be Director+ or reporter to delete')
        return
    }

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
