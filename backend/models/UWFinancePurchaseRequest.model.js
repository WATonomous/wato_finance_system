const mongoose = require('mongoose')

const Schema = mongoose.Schema
const model = mongoose.model
const Types = mongoose.Types

const Constants = require('./Constants')
const PPR_STATUS = Constants.PPR_STATUS

const UWFinancePurchaseSchema = new Schema(
    {
        reporter_id: { type: String, required: true },
        status: { type: String, enum: UPR_STATUS },
        fi_link: { type: Types.ObjectId, ref: 'FundingItem', required: true },
        purchase_url: { type: String, required: true },
        purchase_instructions: { type: String, required: true },
        cost: { type: Number, required: true },
        purchase_justification: { type: String, required: true },
        pickup_instruction: { type: String },
        finance_team_approval: { type: Boolean, default: false },
        team_captain_approval: { type: Boolean, default: false },
        faculty_advisor_approval: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
)

const UWFinancePurchase = mongoose.model(
    'UWFinancePurchase',
    UWFinancePurchaseSchema
)

module.exports = UWFinancePurchase
