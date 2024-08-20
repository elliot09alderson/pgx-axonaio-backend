const mongoose = require('mongoose');

const webhookSchema = new mongoose.Schema({
  webhook_url: {
    type: String,
    required: true
  },
  is_active: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  secret_key: {
    type: String,
    required: true
  },
  payment_failed: String,
  payment_captured: String,
  transfer_processed: String,
  refund_processed: String,
  refund_created: String,
  refund_speed_changed: String,
  order_paid: String,
  dispute_created: String,
  dispute_won: String,
  dispute_lost: String,
  dispute_closed: String,
  settlement_processed: String,
  invoice_paid: String,
  invoice_partially_paid: String,
  invoice_expired: String,
  paylink_paid: String,
  paylink_partially_paid: String,
  paylink_expired: String,
  paylink_cancelled: String,
  newwebhook: Number,
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

module.exports = mongoose.model('LiveWebhook', webhookSchema);
