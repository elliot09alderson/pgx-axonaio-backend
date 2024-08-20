const mongoose = require("mongoose");

const chargebackSchema = new mongoose.Schema({
  chargeback_gid: {
    type: String,
    required: true,
    unique: true,
  },
  transaction_gid: {
    type: String,
    required: true,
  },
  chargeback_amount: {
    type: String,
    required: true,
  },
  chargeback_type: {
    type: String,
    enum: [
      "retrieval",
      "chargeback",
      "pre_arbitration",
      "arbitration",
      "fraud",
    ],
    required: true,
  },
  chargeback_status: {
    type: String,
    enum: [
      "open",
      "under_review",
      "lost",
      "won",
      "closed",
      "processed",
      "processing",
    ],
    required: true,
  },
  chargeback_respond: {
    type: String,
  },
  created_date: {
    type: Date,
    default: Date.now,
  },
  adjDate: String,
  adjType: String,
  remitter: String,
  beneficiary: String,
  txnDate: String,
  rrn: String,
  payee: String,
  txnAmount: Number,
  adjAmount: Number,
  reasonCode: String,
  remarks: String,
  upload: String,
  user_id: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Chargeback", chargebackSchema);
