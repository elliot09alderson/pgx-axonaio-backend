const mongoose = require("mongoose");

const webhookSchema = new mongoose.Schema(
  {
    webhook_url: {
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


const testPayoutWebhook = mongoose.model('TestPayoutWebhook', webhookSchema);
const livePayoutWebhook = mongoose.model('LivePayoutWebhook', webhookSchema);


module.exports = {
  testPayoutWebhook , livePayoutWebhook
}