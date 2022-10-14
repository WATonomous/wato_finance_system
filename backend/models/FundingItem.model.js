const mongoose = require('mongoose')

const Schema = mongoose.Schema

const fundingItemSchema = new Schema(
    {
        ticket_id: { type: Number, required: true },
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
    }
)

const FundingItem = mongoose.model('FundingItem', fundingItemSchema)

module.exports = FundingItem
