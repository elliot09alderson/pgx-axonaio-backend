const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const businessDetailsSchema = new Schema({
  companyName: { type: String, required: true },
  businessType: { type: String, required: true },
  businessCategory: { type: String, required: true },
  m_id: { type: String, required: true, ref:"User" },
  description: { type: String, required: true },
  website: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  address: { type: String, required: true },
  pincode: { type: String, required: true },
}, { timestamps: true });

const BusinessDetails = mongoose.model('BusinessDetails', businessDetailsSchema);

module.exports = BusinessDetails;
