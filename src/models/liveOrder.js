const mongoose = require('mongoose');

const liveOrderSchema = new mongoose.Schema({
  order_gid: {
    type: String,
    required: true
  },
  order_amount: {
    type: Number,
    required: true
  },
  order_attempts: {
    type: Number,
    default: 0
  },
  order_receipt: String,
  order_status: {
    type: String,
    enum: ['Paid', 'Created', 'Attempted'],
    default: 'Created'
  },
  created_date: {
    type: Date,
    default: Date.now
  },
  user_id: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('LiveOrder', liveOrderSchema);
