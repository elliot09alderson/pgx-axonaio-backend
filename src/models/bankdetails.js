const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BankDetailsSchema = new Schema({
  accountHolderName: { type: String, required: true },
  accountType: { type: String, required: true },
  accountNumber: { type: String, required: true },
  confirmAn: { type: String, required: true },
  ifscCode: { type: String, required: true },
  branchName: { type: String, required: true },
  m_id: { type: String, required: true, ref:"User" },

}, { timestamps: true });

const BankDetails = mongoose.model('BankDetails', BankDetailsSchema);

module.exports = BankDetails;
