const PersonalPurchase = require('../models/personalpurchase.model')
const FundingItem = require('../models/fundingitem.model')
const SponsorshipFund = require('../models/sponsorshipfund.model')

const getAllPersonalPurchases = (_, res) => {
    PersonalPurchase.find()
        .then((personalPurchases) => res.json(personalPurchases))
        .catch((err) => res.status(400).json('Error: ' + err))
}

const getPersonalPurchase = (req, res) => {
    PersonalPurchase.findById(req.params.id)
        .then((personalPurchase) => res.json(personalPurchase))
        .catch((err) => res.status(400).json('Error: ' + err))
}

const createPersonalPurchase = (req, res) => {
    const { body } = req
    console.log(body)
    const newPersonalPurchase = new PersonalPurchase(body)

    newPersonalPurchase
        .save()
        .then(() => res.json(newPersonalPurchase))
        .catch((err) => res.status(400).json('Error: ' + err))
}

const updatePersonalPurchase = (req, res) => {
    console.log(req.params.id)
    PersonalPurchase.findByIdAndUpdate(req.params.id, req.body)
        .then(() => res.json(req.body))
        .catch((err) => res.status(400).json('Error: ' + err))
}

const deletePersonalPurchase = (req, res) => {
    PersonalPurchase.findByIdAndDelete(req.params.id)
        .then(() => res.json('PersonalPurchase deleted.'))
        .catch((err) => res.status(400).json('Error: ' + err))
}
const getSponsorshipFund = async (req, res) => {
    const { id } = req.params
    const personalPurchase = await PersonalPurchase.findById(id)
    console.log('personal purchase')
    console.log(personalPurchase)
    const fundingItem = await FundingItem.findById(personalPurchase.fi_link)
    console.log('funding item')
    console.log(fundingItem)
    res.json(await SponsorshipFund.findById(fundingItem.sf_link))
}

module.exports = {
    getAllPersonalPurchases,
    getPersonalPurchase,
    createPersonalPurchase,
    updatePersonalPurchase,
    deletePersonalPurchase,
    getSponsorshipFund,
}
