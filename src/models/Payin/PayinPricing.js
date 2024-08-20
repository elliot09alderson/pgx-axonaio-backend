// token schema
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MerchantPricing = new Schema(
  {
    merchant_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    UPI: String,
    NetBanking: String,
    CC: String,
    DC: String,
    Wallet: String,
    UPI_Collect: String,
  },
  { timestamps: true }
);
const MerchantPricingModel = mongoose.model("MerchantPricing", MerchantPricing);
module.exports = MerchantPricingModel;
