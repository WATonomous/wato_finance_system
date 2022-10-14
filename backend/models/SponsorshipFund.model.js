const mongoose = require('mongoose')
const Types = mongoose.Types
const Schema = mongoose.Schema
const constants = require('./Constants')
const { SF_STATUS, ENDOWMENT_FUNDS } = constants

const SponsorShipFundSchema = new Schema(
    {
        ticket_id: { type: Number, required: true },
        reporter_id: { type: String, required: true },
        status: { type: String, emum: SF_STATUS, required: true },
        organization: { type: String, enum: ENDOWMENT_FUNDS, required: true },
        semester: { type: String, required: true },
        proposal_id: { type: String },
        funding_allocation: { type: Number, required: true },
        funding_spent: { type: Number, default: 0 },
        amount_reimbursed: { type: Number, default: 0 },
        proposal_url: { type: String },
        presentation_url: { type: String },
        claim_deadline: { type: Date, required: true },
        fi_links: [{ type: Types.ObjectId, ref: 'FundingItem' }],
    },
    {
        timestamps: true,
    }
)

const SponsorshipFund = mongoose.model('SponsorshipFund', SponsorShipFundSchema)

module.exports = SponsorshipFund
