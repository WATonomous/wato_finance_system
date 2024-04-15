const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const { Schema } = mongoose

const Constants = require('./constants')
const UPR_STATUS = Constants.UPR_STATUS

const UWFinancePurchaseSchema = new Schema(
    {
        _id: { type: Number },
        reporter_id: { type: String, required: true },
        status: { type: String, enum: UPR_STATUS },
        fi_link: { type: Number, ref: 'FundingItem', required: true },
        name: { type: String, required: true },
        purchase_url: { type: String, required: true },
        purchase_instructions: { type: String, required: true },
        cost: { type: Number, required: true },
        purchase_justification: { type: String, required: true },
        pickup_instruction: { type: String },
        director_approval: { type: Boolean, default: false }, // deprecated
        team_captain_approval: { type: Boolean, default: false }, // deprecated
        admin_approval: { type: Boolean, default: false },
        faculty_advisor_approval: { type: Boolean, default: false },
        requisition_number: { type: String },
        po_number: { type: String },
    },
    {
        _id: false,
        timestamps: true,
    }
)

UWFinancePurchaseSchema.plugin(AutoIncrement, { id: 'UPRcounter' })
const UWFinancePurchase = mongoose.model(
    'UWFinancePurchase',
    UWFinancePurchaseSchema
)

module.exports = UWFinancePurchase
