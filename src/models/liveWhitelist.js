const mongoose = require('mongoose');

const whiteListSchema = new mongoose.Schema({
  ip_name: {
    type: String,
    required: true
  },
  ip_address: {
    type: String,
    required: true
  },
  ip_addr_count: {
    type: Number,
    required: true
  },
  created_date: {
    type: Date,
    default: Date.now
  },
  user_id: {
    type: Number,
    required: true
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('LiveWhiteList', whiteListSchema);
