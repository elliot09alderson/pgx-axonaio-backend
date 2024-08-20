const mongoose = require('mongoose');

const whiteListSchema = new mongoose.Schema({
  
  ip_address: {
    type: String,
    required: true
  },
  ip_addr_count: {
    type: Number,
    required: true
  },
  m_id: {
    type: String,
    ref: "User",
  },
  whitelist_id : String,


},{timestamps:true});

const testPayinWhitelist = mongoose.model('TestPayinWhiteList', whiteListSchema);
const livePayinWhitelist = mongoose.model('LivePayinWhiteList', whiteListSchema);


module.exports = {
  testPayinWhitelist , livePayinWhitelist
}
