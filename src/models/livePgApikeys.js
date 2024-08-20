const mongoose = require('mongoose');

const apiKeySchema = new mongoose.Schema({
  api_key: {
    type: String,
    required: true
  },
  api_secret: {
    type: String,
    required: true
  },
  request_hashkey: String,
  response_hashkey: String,
  request_salt_key: String,
  response_salt_key: String,
  encryption_request_key: String,
  encryption_response_key: String,
  api_expiry: Date,
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

module.exports = mongoose.model('ApiKey', apiKeySchema);
