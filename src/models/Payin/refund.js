const mongoose = require("mongoose");

const refundSchema = new mongoose.Schema(
  {
    refund_id: { type: String, required: true, unique: true },
    m_id: { type: String, required: true, ref: "User" },
    transaction_id: { type: String, required: true },
    refund_amount: { type: Number, required: true },
    refund_notes: { type: String },
    refund_status: { type: String, required: true },
    refund_date: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true }
);

const testRefund = mongoose.model("TestRefund", refundSchema);
const liveRefund = mongoose.model("LiveRefund", refundSchema);

module.exports = {
  testRefund, liveRefund
}

