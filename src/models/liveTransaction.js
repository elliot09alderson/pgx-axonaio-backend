const mongoose = require('mongoose');

const liveTransactionSchema = new mongoose.Schema({
  transaction_gid: {
    type: String,
    required: true
  },
  vendor_transaction_id: String,
  vendor_id: String,
  bank_ref_no: String,
  order_id: {
    type: Number,
    required: true
  },
  transaction_response: String,
  transaction_method_id: {
    type: Number,
    required: true
  },
  
  transaction_type: String,
  transaction_username: String,
  transaction_email: String,
  transaction_contact: String,
  transaction_amount: {
    type: Number,
    required: true
  },
  transaction_status: {
    type: String,
    enum: ['initiated', 'authorized', 'captured', 'refunded', 'failed', 'cancelled'],
    default: 'initiated'
  },
  transaction_mode: String,
  transaction_notes: String,
  transaction_description: String,
  axonaio_tax: {
    type: Number,
    default: 0.0
  },
  goods_service_tax: {
    type: Number,
    default: 0.0
  },
  adjustment_done: {
    type: String,
    enum: ['Y', 'N'],
    default: 'N'
  },
  transaction_date: {
    type: Date,
    required: true
  },
  transaction_ip: String,
  udf1: String,
  udf2: String,
  udf3: String,
  udf4: String,
  udf5: String,
  created_date: {
    type: Date,
    default: Date.now
  },
  user_id: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('LiveTransaction', liveTransactionSchema);
