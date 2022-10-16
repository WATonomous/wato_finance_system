const mongoose = require('mongoose')

const Schema = mongoose.Schema
const Types = mongoose.Types

const Constants = require('./Constants')
const PPR_STATUS = Constants.PPR_STATUS

const PersonalPurchaseSchema = new Schema(
    {
        reporter_id: { type: String, required: true },
        status: { type: String, enum: PPR_STATUS },
        fi_link: { type: Types.ObjectId, ref: 'FundingItem' },
        purchase_url: { type: String, required: true },
        purchase_instructions: { type: String, required: true },
        cost: { type: Number, required: true },
        purchase_justification: { type: String, required: true },
        pickup_instruction: { type: String },
        finance_team_approval: { type: Boolean, default: false },
        team_captain_approval: { type: Boolean, default: false },
        faculty_advisor_approval: { type: Boolean, default: false },
        requisition_number: { type: String },
        po_number: { type: String },
    },
    {
        timestamps: true,
    }
)

const PersonalPurchase = mongoose.model(
    'PersonalPurchase',
    PersonalPurchaseSchema
)

module.exports = PersonalPurchase
