const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const { Schema } = mongoose

const Constants = require('./constants')
const PPR_STATUS = Constants.PPR_STATUS

const PersonalPurchaseSchema = new Schema(
    {
        _id: { type: Number },
        reporter_id: { type: String, required: true },
        status: { type: String, enum: PPR_STATUS },
        fi_link: {
            type: Number,
            ref: 'FundingItem',
            required: true,
        },
        name: { type: String, required: true },
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
        _id: false,
        timestamps: true,
        collection: 'personalpurchases',
    }
)

PersonalPurchaseSchema.plugin(AutoIncrement, { id: 'PPRcounter' })
const PersonalPurchase = mongoose.model(
    'PersonalPurchase',
    PersonalPurchaseSchema
)

module.exports = PersonalPurchase
