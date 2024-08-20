const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PayLinkSchema = new Schema(
  {
    createdAt: {
      type: Date,
      required: true,
    },
    linkId: {
      type: String,
    },
    fxLinkID: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    total_paid: {
      type: Number,
      default: 0,
    },
    name: {
      type: String,
    },
    phoneNo: {
      type: String,
      required: true,
    },
    emailID: {
      type: String,
    },
    status: {
      type: String,
      required: true,
      enum: ["Paid", "Failed", "Active"],
      default: "Active",
    },
    shortUrl: {
      type: String,
      required: true,
    },
    merchant_employee: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    linkExpire: {
      type: Date,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Paylink = mongoose.model("paylink", PayLinkSchema);

module.exports = Paylink;
