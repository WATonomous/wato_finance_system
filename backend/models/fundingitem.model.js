const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const { Schema, Types } = mongoose

const FundingItemSchema = new Schema(
    {
        _id: { type: Number },
        sf_link: {
            type: Types.ObjectId,
            ref: 'SponsorshipFund',
            required: true,
        },
        ppr_links: [{ type: Types.ObjectId, ref: 'PersonalPurchase' }],
        upr_links: [{ type: Types.ObjectId, ref: 'UWFinancePurchase' }],
        funding_allocation: { type: Number, required: true },
        funding_spent: { type: Number },
        amount_reimbursed: { type: Number },
        purchase_justification: { type: String },
    },
    {
        _id: false,
        timestamps: true,
        collection: 'fundingitems',
    }
)

FundingItemSchema.plugin(AutoIncrement, { id: 'FIcounter' })
const FundingItem = mongoose.model('FundingItem', FundingItemSchema)

module.exports = FundingItem
