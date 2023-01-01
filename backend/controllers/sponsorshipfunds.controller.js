const SponsorshipFund = require('../models/sponsorshipfund.model')
const {
    getFundingItemsBySponsorshipFund,
    getPersonalPurchasesByFundingItem,
    getUWFinancePurchasesByFundingItem,
    getSponsorshipFundFundingSpentByFILinks,
} = require('../helpers.js')

const getAllSponsorshipFunds = (_, res) => {
    SponsorshipFund.find().lean()
        .then(async (sponsorshipFunds) => {
            const augmentedSponsorshipFunds = await Promise.all(sponsorshipFunds.map(async (sponsorshipFund) => {
                sponsorshipFund.funding_spent = await getSponsorshipFundFundingSpentByFILinks(sponsorshipFund.fi_links)
                return sponsorshipFund
            }))
            res.json(augmentedSponsorshipFunds)
        })
        .catch((err) => res.status(400).json(err))
}

const getSponsorshipFund = (req, res) => {
    const { id } = req.params
    SponsorshipFund.findById(id).lean()
        .then(async (sponsorshipFund) => {
            if (!sponsorshipFund) {
                res.status(404)
                throw new Error('Sponsorship Fund not found')
            }
            sponsorshipFund.funding_spent = await getSponsorshipFundFundingSpentByFILinks(sponsorshipFund.fi_links)
            res.status(200).json(sponsorshipFund)
        })
        .catch((err) => res.status(400).json(err))
}

// this function reaches all the way down to the children
const getAllChildren = async (req, res) => {
    const { id } = req.params
    const fundingItems = await getFundingItemsBySponsorshipFund(id) // augment with funding spent
    const sponsorshipfund = await SponsorshipFund.findById(id).lean() // augment with funding spent
    const allData = await Promise.all(
        fundingItems.map(async (fundingItem) => {
            const personalPurchases = await getPersonalPurchasesByFundingItem(
                fundingItem
            )
            const uwFinancePurchases = await getUWFinancePurchasesByFundingItem(
                fundingItem
            )
            return {
                ...fundingItem.toObject(),
                personalPurchases,
                uwFinancePurchases,
            }
        })
    )
    res.json({ ...sponsorshipfund, fundingItems: allData })
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
