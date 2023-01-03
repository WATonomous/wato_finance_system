const SponsorshipFund = require('../models/sponsorshipfund.model')
const {
    getUpdatedFundingItemsByIdList,
    getPersonalPurchasesByFundingItem,
    getUWFinancePurchasesByFundingItem,
    getUpdatedSponsorshipFundsByIdList,
} = require('../helpers.js')

const getAllSponsorshipFunds = (_, res) => {
    getUpdatedSponsorshipFundsByIdList([])
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
            res.status(200).json(sponsorshipFunds[0])
        })
        .catch((err) => res.status(400).json(err))
}

// this function reaches all the way down to the children
const getAllChildren = async (req, res) => {
    const { id } = req.params

    const sponsorshipFunds = await getUpdatedSponsorshipFundsByIdList([id]) // augment with funding spent
    const sponsorshipFund = sponsorshipFunds[0]
    const fundingItems = await getUpdatedFundingItemsByIdList(sponsorshipFund.fi_links) // augment with funding spent
    const allData = await Promise.all(
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
    res.json({ ...sponsorshipFund, fundingItems: allData })
}

const createSponsorshipFund = (req, res) => {
    const { body } = req
    const newSponsorshipFund = new SponsorshipFund(body)

    newSponsorshipFund
        .save()
        .then(() => res.json(newSponsorshipFund))
        .catch((err) => res.status(400).json('Error: ' + err))
}

const updateSponsorshipFund = (req, res) => {
    const { id } = req.params
    const updatedFields = req.body
    SponsorshipFund.findById(id)
        .then((sponsorshipFundToUpdate) => {
            if (!sponsorshipFundToUpdate) {
                res.status(404)
                throw new Error('Sponsorship Fund not found')
            }
            SponsorshipFund.findByIdAndUpdate(
                sponsorshipFundToUpdate._id,
                updatedFields,
                {
                    new: false,
                }
            )
                .then(() => res.status(200).json(updatedFields))
                .catch((err) => res.status(400).json(err))
        })
        .catch((err) => res.status(400).json(err))
}

const deleteSponsorshipFund = (req, res) => {
    const { id } = req.params
    SponsorshipFund.findById(id)
        .then((sponsorshipFundToDelete) => {
            if (!sponsorshipFundToDelete) {
                res.status(404)
                throw new Error('Sponsorship Fund not found')
            }
            res.status(200).json(sponsorshipFundToDelete)
            sponsorshipFundToDelete.remove()
        })
        .catch((err) => res.status(400).json(err))
}

module.exports = {
    getAllSponsorshipFunds,
    createSponsorshipFund,
    getSponsorshipFund,
    updateSponsorshipFund,
    deleteSponsorshipFund,
    getAllChildren,
}
