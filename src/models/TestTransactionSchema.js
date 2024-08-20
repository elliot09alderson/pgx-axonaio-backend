// token schema
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require("uuid");
const TransactionSchema = new Schema(
  {
    transaction_gid: {
      type: String,
      default: uuidv4(),
    },
    vendor_transaction_id: {
      type: String,
    },
    bank_ref_no: {
      type: String,
    },
    order_id: {
      type: String,
    },
    app_id: {
      type: Schema.Types.ObjectId,
    },
    transaction_response: {
      type: String,
    },
    transaction_method_id: {
      type: String,
    },
    transaction_type: {
      type: String,
    },
    transaction_username: {
      type: String,
    },
    transaction_email: {
      type: String,
    },
    transaction_contact: {
      type: String,
    },
    transaction_amount: {
      type: Number,
    },
    transaction_status: {
      type: String,
      enum: [
        "captured",
        "refunded",
        "failed",
        "cancelled",
        "success",
        "pending",
      ],
      default: "pending",
    },
    transaction_mode: {
      type: String,
    },
    transaction_notes: {
      type: String,
    },
    transaction_description: {
      type: String,
    },
    merchant_tax: {
      type: String,
    },
    goods_service_tax: {
      type: String,
    },
    android_status: {
      type: Boolean,
      default: false,
    },
    settlement_done: {
      type: Boolean,
      default: false,
    },
    transaction_date: {
      type: Date
    },
    merchant_employee: {
      type: String,
    },
    created_employee: {
      type: String,
    },
    transaction_flow: {
      type: String,
    },
    transaction_device: {
      type: String,
    },
    udf1: {
      type: String,
    },
    udf2: {
      type: String,
    },
    udf3: {
      type: String,
    },
    udf4: {
      type: String,
    },
    udf5: {
      type: String,
    },
  },
  { timestamps: true }
);
const TestTransaction = mongoose.model("testtransaction", TransactionSchema);
module.exports = TestTransaction;
