const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const Schema = mongoose.Schema

const FundingItemSchema = new Schema(
    {
        sf_link: {
            type: mongoose.Types.ObjectId,
            ref: 'SponsorshipFund',
            required: true,
        },
        ppr_links: [{ type: mongoose.Types.ObjectId, ref: 'PersonalPurchase' }],
        upr_links: [
            { type: mongoose.Types.ObjectId, ref: 'UWFinancePurchase' },
        ],
        funding_allocation: { type: Number, required: true },
        funding_spent: { type: Number },
        amount_reimbursed: { type: Number },
        purchase_justification: { type: String },
    },
    {
        timestamps: true,
        collection: 'fundingitem',
    }
)

fundingItemSchema.plugin(AutoIncrement, { inc_field: 'fi_id' })
const FundingItem = mongoose.model('FundingItem', fundingItemSchema)

module.exports = FundingItem
