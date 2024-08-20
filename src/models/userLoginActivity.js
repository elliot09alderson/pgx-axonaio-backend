const mongoose = require("mongoose");

const logActivitySchema = new mongoose.Schema({
  log_ipaddress: {
    type: String,
    required: true
  },
  log_device: {
    type: String,
    required: true
  },
  log_os: {
    type: String,
    required: true
  },
  log_browser: {
    type: String,
    required: true
  },
  log_time: {
    type: Date,
    default: Date.now,
    required: true
  },
  user_id: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("userLogActivity", logActivitySchema);
