// token schema
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require("uuid");

const SettlementSchema = new Schema(
  {
    settlement_gid: {
      type: String,
      default: uuidv4(),
    },
    settlement_receiptno_count: {
      type: Number,
    },
    settlement_receiptno: {
      type: String,
    },
    current_balance: {
      type: String,
    },
    settlement_amount: {
      type: Number,
    },
    settlement_fee: {
      type: Number,
    },
    settlement_tax: {
      type: Number,
    },
    total_deduction: {
      type: Number,
    },
    app_id: {
      type: Schema.Types.ObjectId,
    },
    settlement_status: {
      type: String,
      enum: ["processed", "inprocess", "failed", "pending"],
    },
    settlement_date: {
      type: Date,
    },
    merchant_employee: {
      type: Schema.Types.ObjectId,
    },
    transaction_id: {
      type: String,
      required: true,
    },
    transaction_date: {
      type: Date,
    },
  },
  { timestamps: true }
);
const TestSettlement = mongoose.model("testsettlement", SettlementSchema);
module.exports = TestSettlement;
