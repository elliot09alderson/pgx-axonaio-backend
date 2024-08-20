const mongoose = require('mongoose')
const Schema = mongoose.Schema

const WhiteLabelSchema = Schema({
  merchantId: Schema.Types.ObjectId,
  domain: String,
  ipAddress: String,
  merchantLogo: String,
  companyName: String,
  contactNumber: String,
  emailId: String,
  companyAddress: String,
  merchantTemplateId: Schema.Types.ObjectId
}, { timestamps: true })

var WhiteLabel = mongoose.model('whitelabel', WhiteLabelSchema)
module.exports = { WhiteLabel }