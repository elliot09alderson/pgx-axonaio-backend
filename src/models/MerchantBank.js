// MerchantBank schema
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const MerchantShema = new Schema({
  merchant_id: {
    type: Schema.Types.ObjectId
  },
  cc_card: {
    type: String
  },
  dc_card: {
    type: String
  },
  net: {
    type: String
  },
  upi: {
    type: String
  },
  qrcode: {
    type: String
  },
  wallet: {
    type: String
  },
  upi: {
    type: String
  },
  business_type: {
    type: String
  },
  created_date: {
    type: String
  },
  created_user: {
    type: String
  },
}, { timestamps: true });
const MerchantBank = mongoose.model("MerchantBank", MerchantShema);
module.exports = MerchantBank;