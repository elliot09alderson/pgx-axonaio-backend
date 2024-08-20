const mongoose = require("mongoose");

const apiKeySchema = new mongoose.Schema(
  {
    salt_key: {
      type: String,
      required: true,
    },
    secret_key: {
      type: String,
      required: true,
    },
    AES_key: {
      type: String,
      required: true,
    },
    mid_key: {
      type: String,
      required: true,
    },
    m_id: {
      type: String,
      ref: "User",
    },
  },
  { timestamps: true }
);

const testPayinApiKey=  mongoose.model("TestPayinApiKey", apiKeySchema);
const livePayinApiKey = mongoose.model("LivePayinApiKey", apiKeySchema);

module.exports = {
  testPayinApiKey,
  livePayinApiKey,
};