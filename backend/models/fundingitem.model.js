const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const { Schema } = mongoose

const FundingItemSchema = new Schema(
    {
        _id: { type: Number },
        reporter_id: { type: String, required: true },
        sf_link: {
            type: Number,
            ref: 'SponsorshipFund',
            required: true,
        },
        name: { type: String, required: true },
        ppr_links: [{ type: Number, ref: 'PersonalPurchase', default: [] }],
        upr_links: [{ type: Number, ref: 'UWFinancePurchase', default: [] }],
        funding_allocation: { type: Number, required: true },
        purchase_justification: { type: String },
    },
    {
        _id: false,
        timestamps: true,
    }
)

FundingItemSchema.plugin(AutoIncrement, { id: 'FIcounter' })
const FundingItem = mongoose.model('FundingItem', FundingItemSchema)

module.exports = FundingItem
