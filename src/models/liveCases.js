const mongoose = require("mongoose");

const liveCaseSchema = new mongoose.Schema({
  case_git: {
    type: String,
    required: true,
  },
  transaction_gid: {
    type: String,
    required: true,
  },
  case_amount: {
    type: Number,
    required: true,
  },
  case_notes: {
    type: String,
  },
  case_status: {
    type: String,
    enum: ["processed", "processing", "close"],
    required: true,
  },
  created_date: {
    type: Date,
    default: Date.now,
  },
  user_id: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("liveCase", liveCaseSchema);
