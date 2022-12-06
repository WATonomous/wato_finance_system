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

const createPersonalPurchase = async (req, res) => {
    const { body } = req
    const newPersonalPurchase = new PersonalPurchase(body)

    try {
        const newPPR = await newPersonalPurchase.save()
        await FundingItem.findByIdAndUpdate(newPPR.fi_link, {
            $push: { ppr_links: newPPR._id },
        })
        res.json(newPPR)
    } catch (err) {
        res.status(400).json('Error: ' + err)
    }
}

const updatePersonalPurchase = (req, res) => {
    console.log(req.params.id)
    PersonalPurchase.findByIdAndUpdate(req.params.id, req.body)
        .then(() => res.json(req.body))
        .catch((err) => res.status(400).json('Error: ' + err))
}

const deletePersonalPurchase = async (req, res) => {
    try {
        await PersonalPurchase.findByIdAndDelete(req.params.id)
        FundingItem.findByIdAndUpdate(req.body.fi_link, {
            $pull: { ppr_links: req.params.id },
        })
        res.json('PersonalPurchase deleted.')
    } catch (err) {
        res.status(400).json('Error: ' + err)
    }
}
const getSponsorshipFund = async (req, res) => {
    const { id } = req.params
    const personalPurchase = await PersonalPurchase.findById(id)
    const fundingItem = await FundingItem.findById(personalPurchase.fi_link)
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
