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

const createNewUWFinancePurchase = (req, res) => {
    const { body } = req
    const newUWFinancePurchase = new UWFinancePurchase(body)
    newUWFinancePurchase
        .save()
        .then(() => res.json(newUWFinancePurchase))
        .catch((err) => res.status(400).json('Error: ' + err))
}

const updateUWFinancePurchase = (req, res) => {
    UWFinancePurchase.findByIdAndUpdate(req.params.id, req.body)
        .then(() => res.json(req.body))
        .catch((err) => res.status(400).json('Error: ' + err))
}

const deleteUWFinancePurchase = (req, res) => {
    UWFinancePurchase.findByIdAndDelete(req.params.id)
        .then(() => res.json('UWFinancePurchase deleted.'))
        .catch((err) => res.status(400).json('Error: ' + err))
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
