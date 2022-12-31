const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const { Schema } = mongoose

const constants = require('./constants')
const { SF_STATUS, ENDOWMENT_FUNDS } = constants

const SponsorshipFundSchema = new Schema(
    {
        _id: { type: Number },
        reporter_id: { type: String, required: true },
        status: { type: String, emum: SF_STATUS, required: true },
        organization: { type: String, enum: ENDOWMENT_FUNDS, required: true },
        semester: { type: String, required: true },
        proposal_id: { type: String },
        funding_allocation: { type: Number, required: true },
        proposal_url: { type: String },
        presentation_url: { type: String },
        claim_deadline: { type: Date, required: true },
        fi_links: [{ type: Number, ref: 'FundingItem', default: [] }],
    },
    {
        _id: false,
        timestamps: true,
    }
)

SponsorshipFundSchema.plugin(AutoIncrement, { id: 'SFcounter' })
const SponsorshipFund = mongoose.model('SponsorshipFund', SponsorshipFundSchema)

module.exports = SponsorshipFund
