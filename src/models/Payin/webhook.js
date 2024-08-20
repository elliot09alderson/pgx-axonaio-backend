const mongoose = require("mongoose");

const webhookSchema = new mongoose.Schema(
  {
    webhook_url: {
      type: String,
      required: true,
    },
    written_url: {
      type: String,
    },
    m_id: {
      type: String,
      ref: "User",
    },
    webhook_id : String,
    
  },
  { timestamps: true }
);

const testPayinWebhook = mongoose.model("TestPayinWebhook", webhookSchema);
const livePayinWebhook = mongoose.model("livePayinWebhook", webhookSchema);

module.exports ={
  testPayinWebhook,
  livePayinWebhook
}

