
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MerchantAppsRequestSchema = Schema({
  merchant_id: Schema.Types.ObjectId,
  app_id:
  {
    type: Schema.Types.ObjectId
  },
  useCase: {
    type: String
  }

}, { timestamps: true })

const MerchantAppsRequest = mongoose.model('merchantappsrequest', MerchantAppsRequestSchema)
module.exports = MerchantAppsRequest 