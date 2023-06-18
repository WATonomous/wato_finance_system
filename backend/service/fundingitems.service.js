const FundingItem = require('../models/fundingitem.model')
const SponsorshipFund = require('../models/sponsorshipfund.model')
const PersonalPurchase = require('../models/personalpurchase.model')
const UWFinancePurchase = require('../models/uwfinancepurchase.model')
const { getAnnotatedFundingItemsByIdList } = require('./annotatedGetters')

const getAllFundingItems = () => {
    return getAnnotatedFundingItemsByIdList()
}

const getFundingItem = async (id) => {
    const FI = await getAnnotatedFundingItemsByIdList([id])
    return FI[0]
}

const createFundingItem = async (body) => {
    const newFundingItem = new FundingItem(body)
    const newFI = await newFundingItem.save()
    // update the parent SF to store link to child FI
    return SponsorshipFund.findByIdAndUpdate(
        newFI.sf_link,
        {
            $push: { fi_links: newFI._id },
        },
        {
            new: true,
        }
    )
}

const updateFundingItem = (id, body) => {
    return FundingItem.findByIdAndUpdate(id, body, {
        new: true,
    })
}

const deleteFundingItem = async (id) => {
    return cascadeDeleteFundingItem(id)
}

const cascadeDeleteFundingItem = async (id) => {
    const FIToDelete = await FundingItem.findById(id)
    const { ppr_links, upr_links } = FIToDelete
    await SponsorshipFund.findByIdAndUpdate(FIToDelete.sf_link, {
        $pull: { fi_links: id },
    })
    await PersonalPurchase.deleteMany({ _id: { $in: ppr_links } })
    await UWFinancePurchase.deleteMany({ _id: { $in: upr_links } })
    return FIToDelete.remove()
}

module.exports = {
    getAllFundingItems,
    getFundingItem,
    createFundingItem,
    updateFundingItem,
    deleteFundingItem,
    cascadeDeleteFundingItem,
}
