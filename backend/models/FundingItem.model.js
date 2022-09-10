import { Schema, model, Types } from "mongoose";

const FundingItemSchema = new Schema(
  {
    sf_link: { type: Types.ObjectId, ref: "SponsorshipFund", required: true },
    ppr_links: [{ type: Types.ObjectId, ref: "PersonalPurchase" }],
    upr_links: [{ type: Types.ObjectId, ref: "UWFinancePurchase" }],
    funding_allocation: { type: Number, required: true },
    funding_spent: { type: Number },
    amount_reimbursed: { type: Number },
    purchase_justification: { type: String },
  },
  {
    timestamps: true,
  }
);

export default model("FundingItem", FundingItemSchema);
