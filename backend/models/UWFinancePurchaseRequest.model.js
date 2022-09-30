import { Schema, model, Types } from "mongoose";
import { UPR_STATUS } from "./Constants";

const UWFinancePurchaseSchema = new Schema(
  {
    reporter_id: { type: String, required: true },
    status: { type: String, enum: UPR_STATUS },
    fi_link: { type: Types.ObjectId, ref: "FundingItem", required: true },
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
);

export default model("UWFinancePurchase", UWFinancePurchaseSchema);
