import { Schema, model, Types } from 'mongoose'
import { SF_STATUS, ENDOWMENT_FUNDS } from './Constants'

const SponsorShipFundSchema = new Schema(
    {
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

export default model('SponsorshipFund', SponsorShipFundSchema)
