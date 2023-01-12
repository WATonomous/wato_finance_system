const SponsorshipFund = require('../models/sponsorshipfund.model')
const FundingItem = require('../models/fundingitem.model')
const {
    getUpdatedFundingItemsByIdList,
    getPersonalPurchasesByFundingItem,
    getUWFinancePurchasesByFundingItem,
    getUpdatedSponsorshipFundsByIdList,
} = require('../helpers.js')
const { cascadeDeleteFundingItem } = require('./fundingitems.controller')

const getAllSponsorshipFunds = (_, res) => {
    getUpdatedSponsorshipFundsByIdList()
        .then((sponsorshipFunds) => {
            res.json(sponsorshipFunds)
        })
        .catch((err) => res.status(400).json(err))
}

const getSponsorshipFund = (req, res) => {
    const { id } = req.params
    getUpdatedSponsorshipFundsByIdList([id])
        .then((sponsorshipFunds) => {
            if (!sponsorshipFunds) {
                res.status(404)
                throw new Error('Sponsorship Fund not found')
            }
            res.json(sponsorshipFunds[0])
        })
        .catch((err) => res.status(400).json(err))
}

// this function reaches all the way down to the children
const getAllChildren = async (req, res) => {
    const { id } = req.params

    const sponsorshipFunds = await getUpdatedSponsorshipFundsByIdList([id])
    const sponsorshipFund = sponsorshipFunds[0]
    const fundingItems = await getUpdatedFundingItemsByIdList(
        sponsorshipFund.fi_links
    )
    const allSFChildren = await Promise.all(
        fundingItems.map(async (fundingItem) => {
            const personalPurchases = await getPersonalPurchasesByFundingItem(
                fundingItem
            )
            const uwFinancePurchases = await getUWFinancePurchasesByFundingItem(
                fundingItem
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
    getAllSponsorshipFunds,
    createSponsorshipFund,
    getSponsorshipFund,
    updateSponsorshipFund,
    deleteSponsorshipFund,
    getAllChildren,
}
