const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const settlementSchema = new Schema({
  settlementDate: { type: Date, required: true },
  partnerId: { type: String, required: true },
  merchantName: { type: String, required: true },
  payeeVpa: { type: String, required: true },
  cycle: { type: String },
  timeoutCount: { type: Number },
  timeoutVolume: { type: Number },
  successCount: { type: Number },
  successVolume: { type: Number },
  totalCount: { type: Number },
  totalVolume: { type: Number },
  charges: { type: Number },
  chargeback: { type: Number },
  prevDayCreditAdj: { type: Number },
  netSettlement: { type: Number },
  transferred: { type: Number },
  fundReleased: { type: Number },
  cutOff: { type: Number },
  difference: { type: Number },
  utrNo: { type: String },
  remarks: { type: String },
  m_id: {
    type: String,
    ref: "User",
  },
});

const Settlement = mongoose.model("PaySettlementIn", settlementSchema);

module.exports = Settlement;
