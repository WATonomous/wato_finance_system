const FundingItem = require('../models/fundingitem.model')
const SponsorshipFund = require('../models/sponsorshipfund.model')
const UWFinancePurchase = require('../models/uwfinancepurchase.model')

const getAllUWFinancePurchases = (_, res) => {
    UWFinancePurchase.find()
        .then((UWFinancePurchase) => res.json(UWFinancePurchase))
        .catch((err) => res.status(400).json('Error: ' + err))
}

const getUWFinancePurchase = (req, res) => {
    UWFinancePurchase.findById(req.params.id)
        .then((UWFinancePurchase) => res.json(UWFinancePurchase))
        .catch((err) => res.status(400).json('Error: ' + err))
}

const createNewUWFinancePurchase = async (req, res) => {
    const { body } = req
    const newUWFinancePurchase = new UWFinancePurchase(body)
    try {
        const newUWFP = await newUWFinancePurchase.save()
        await FundingItem.findByIdAndUpdate(newUWFP.fi_link, {
            $push: { upr_links: newUWFP._id },
        })
        res.json(newUWFP)
    } catch (err) {
        res.status(400).json('Error: ' + err)
    }
}

const updateUWFinancePurchase = (req, res) => {
    UWFinancePurchase.findByIdAndUpdate(req.params.id, req.body)
        .then(() => res.json(req.body))
        .catch((err) => res.status(400).json('Error: ' + err))
}

const deleteUWFinancePurchase = async (req, res) => {
    try {
        await UWFinancePurchase.findByIdAndDelete(req.params.id)
        FundingItem.findByIdAndUpdate(req.body.fi_link, {
            $pull: { upr_links: req.params.id },
        })
    } catch (err) {
        res.status(400).json('Error: ' + err)
    }
    res.json('UW Finance Purchase deleted.')
}

const getSponsorshipFund = async (req, res) => {
    const { id } = req.params
    const uwFinancePurchase = await UWFinancePurchase.findById(id)
    const fundingItem = await FundingItem.findById(uwFinancePurchase.fi_link)
    res.json(await SponsorshipFund.findById(fundingItem.sf_link))
}

module.exports = {
    getAllUWFinancePurchases,
    getUWFinancePurchase,
    createNewUWFinancePurchase,
    updateUWFinancePurchase,
    deleteUWFinancePurchase,
    getSponsorshipFund,
}
