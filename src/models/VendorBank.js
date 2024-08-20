// VendorBank schema
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const Schema = mongoose.Schema;
const VendorSchema = new Schema({
  vendor_id: {
    type: String,
    required: true,
    default: uuidv4()
  },
  bank_name: {
    type: String,
    required: true
  }
}, { timestamps: true });
const VendorBank = mongoose.model("vendorbank", VendorSchema);
module.exports = VendorBank;