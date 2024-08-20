const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ResellerPayIn = Schema({
  Merchant_Gid: String,
  Merchant_Name: { type: String, required: true },
  Count: { type: Number },
  transaction_amount: { type: Number },
  merchant_percentage: { type: Number },
  Charge: { type: Number },
  charge_amount: { type: Number },
  GST: { type: String },
  GST_charge: { type: Number },
  amount_charged: { type: Number },
  commission_percentage: { type: Number },
  commission_charge_amount: { type: Number },
  commission_GST: { type: String },
  commission_GST_Charge: { type: Number },
  commission_amount: { type: Number },
  total_amount: { type: Number },
  transaction_date: { type: Date, default: Date.now() },
  createdAt: { type: Date, default: Date.now() },
});

const ResellerPayinModel = mongoose.model("ResellerPayin", ResellerPayIn);

module.exports = ResellerPayinModel;
