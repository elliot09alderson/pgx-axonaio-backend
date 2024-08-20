const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  transaction_id: String,
  vendor_transaction_id: String,
  vendor_id: String,
  bank_ref_no: String,
  isSettled: { type: Boolean, default: false },
  settledDate: { type: String, default: "null" },
  transaction_attempts: { type: Number, default: 1 },
  order_id: { type: mongoose.Schema.Types.ObjectId, refPath: 'order_model' }, // Dynamic reference
  transaction_response: String,
  transaction_method_id: { type: Number, required: true },
  transaction_type: String,
  transaction_username: String,
  transaction_email: String,
  transaction_contact: String,
  transaction_amount: { type: Number, required: true },
  transaction_status: {
    type: String,
    enum: ["initiated", "authorized", "captured", "refunded", "failed", "cancelled"],
    default: "initiated",
  },
  transaction_mode: String,
  transaction_notes: String,
  transaction_description: String,
  axonaio_tax: { type: Number, default: 0.0 },
  goods_service_tax: { type: Number, default: 0.0 },
  adjustment_done: { type: String, enum: ["Y", "N"], default: "N" },
  transaction_date: { type: Date, default: Date.now, required: true },
  transaction_ip: String,
  udf1: String,
  udf2: String,
  udf3: String,
  udf4: String,
  udf5: String,
  m_id: { type: String },
  order_model: {
    type: String,
    required: true,
    enum: ['PayinOrder', 'LivePayinOrder'], // Enum for dynamic ref
  },
}, { timestamps: true });

const testPayinTransaction = mongoose.model("TestPayinTransaction", TransactionSchema);
const livePayinTransaction = mongoose.model("LivePayinTransaction", TransactionSchema);

module.exports = { testPayinTransaction, livePayinTransaction };
