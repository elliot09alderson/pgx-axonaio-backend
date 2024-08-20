// report schema
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const reportSchema = new Schema({
  report_from: {
    type: Date
  },
  report_to: {
    type: Date
  },
  payment_mode: {
    type: String,
  },
  transaction_status: {
    type: String
  },
  report_type: {
    type: String
  },
  report_date: {
    type: Date,
  },
  merchant_employee: {
    type: Schema.Types.ObjectId,
    required: true
  }
}, { timestamps: true });
const Reports = mongoose.model("report", reportSchema);
module.exports = Reports;