const mongoose = require('mongoose')
const Schema = mongoose.Schema

const LogSchema = Schema({
  browserName: String,
  deviceName: String,
  ipAddress: String,  
  domain: String
}, { timestamps: true })

const LogTable = mongoose.model('logtable', LogSchema)
module.exports = { LogTable }