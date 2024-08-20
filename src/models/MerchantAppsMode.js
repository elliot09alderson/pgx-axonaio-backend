
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MerchantAppsModeSchema = Schema({
  merchant_id: Schema.Types.ObjectId,
  app_id: [
    {
      type: Schema.Types.ObjectId
    }
  ]

}, { timestamps: true })

const MerchantAppSMode = mongoose.model('merchantappsmode', MerchantAppsModeSchema)
module.exports = MerchantAppSMode 