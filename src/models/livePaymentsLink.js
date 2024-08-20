const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const livePaymentLinkSchema = new Schema({
  paylink_gid: { type: String, required: true },
  paylink_for: { type: String },
  paylink_amount: { type: Number, required: true },
  paylink_customer_email: { type: String },
  email_paylink: { type: String },
  paylink_customer_mobile: { type: String },
  mobile_paylink: { type: String, enum: ['Y', 'N'] },
  paylink_receipt: { type: String },
  paylink_payid: { type: String },
  paylink_expiry: { type: Date },
  paylink_link: { type: String },
  paylink_notes: { type: String },
  paylink_partial: { type: String, enum: ['Y', 'N'] },  
  paylink_partial_amount: { type: Number },
  paylink_status: { type: String, enum: ['issued', 'partially_paid', 'paid', 'cancelled', 'expired', 'failed'] },
  paylink_auto_reminder: { type: String, enum: ['Y', 'N'] },
  paylink_type: { type: String, enum: ['smart', 'quick'] },
  created_date: { type: Date, default: Date.now },
  user_id: { type: Number }
});

const LivePaymentLink = mongoose.model("LivePaymentLink", livePaymentLinkSchema);

module.exports = LivePaymentLink;
