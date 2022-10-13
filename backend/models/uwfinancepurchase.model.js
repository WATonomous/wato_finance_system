const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const Schema = mongoose.Schema
const Types = mongoose.Types

const Constants = require('./constants')
const UPR_STATUS = Constants.UPR_STATUS

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
        requisition_number: { type: String },
        po_number: { type: String },
    },
    {
        timestamps: true,
        collection: 'UWFinancePurchase',
    }
)

UWFinancePurchaseSchema.plugin(AutoIncrement, { inc_field: 'upr_id' })
const UWFinancePurchase = mongoose.model(
    'UWFinancePurchase',
    UWFinancePurchaseSchema
)

module.exports = UWFinancePurchase
