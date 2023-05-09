const FundingItem = require('../models/fundingitem.model')
const UWFinancePurchase = require('../models/uwfinancepurchase.model')
const {
    getAnnotatedSponsorshipFundsByIdList,
    getAnnotatedUWFinancePurchasesByIdList,
} = require('./annotatedGetters')
const getAllUWFinancePurchases = (_, res) => {
    getAnnotatedUWFinancePurchasesByIdList()
        .then((uwFinancePurchases) => res.json(uwFinancePurchases))
        .catch((err) => res.status(400).json('Error: ' + err))
}

const getUWFinancePurchase = (req, res) => {
    getAnnotatedUWFinancePurchasesByIdList([req.params.id])
        .then((uwFinancePurchases) => res.json(uwFinancePurchases[0]))
        .catch((err) => res.status(400).json('Error: ' + err))
}

const createNewUWFinancePurchase = async (req, res) => {
    const newUWFinancePurchase = new UWFinancePurchase(req.body)
    try {
        const newUPR = await newUWFinancePurchase.save()
        await FundingItem.findByIdAndUpdate(newUPR.fi_link, {
            $push: { upr_links: newUPR._id },
        })
        res.json(newUPR)
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
        const UPRid = req.params.id
        const UPRtoDelete = await UWFinancePurchase.findById(UPRid)
        await FundingItem.findByIdAndUpdate(UPRtoDelete.fi_link, {
            $pull: { upr_links: UPRid },
        })
        const deleted = await UPRtoDelete.remove()
        res.json(deleted)
    } catch (err) {
        res.status(400).json('Error: ' + err)
    }
}

const getSponsorshipFund = async (req, res) => {
    const uwFinancePurchase = await UWFinancePurchase.findById(req.params.id)
    const fundingItem = await FundingItem.findById(uwFinancePurchase?.fi_link)
    getAnnotatedSponsorshipFundsByIdList([fundingItem?.sf_link])
        .then((sponsorshipFunds) => {
            res.json(sponsorshipFunds[0])
        })
        .catch((err) => res.status(400).json('Error: ' + err))
}

module.exports = {
    getAnnotatedUWFinancePurchasesByIdList,
    getAllUWFinancePurchases,
    getUWFinancePurchase,
    createNewUWFinancePurchase,
    updateUWFinancePurchase,
    deleteUWFinancePurchase,
    getSponsorshipFund,
}
