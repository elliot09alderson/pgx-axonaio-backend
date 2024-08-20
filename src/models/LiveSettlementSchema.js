// token schema
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require("uuid");

// SNO	TYPE	Date & Time	Order ID	Agent Name	Order Amt.	Transaction ID	Transaction Amount	Phone Number	Payment Method	Status	Edit
const SetllementSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId },
    settlement_gid: {
      type: String,
      default: uuidv4(),
    },
    transaction_gid: {
      type: String,
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
    settlement_status: {
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
    settlement_date: {
      type: Date,
    },
    created_date: {
      type: Date,
      default: Date.now(),
    },
    created_merchant: { type: String },
    updated_at: { type: Date },
  },
  { timestamps: true }
);
const SetllementModel = mongoose.model("livesettlement", SetllementSchema);
module.exports = SetllementModel;
