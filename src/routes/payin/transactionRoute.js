var express = require("express");
const {
  verifyToken,
  verifyMerchantToken,
} = require("../../middleware/authorization");
const {
  createTransaction,
  getTodaysTransaction,
  getTransactionByDate,
} = require("../../controllers/payin/PayIntransactionController");
var router = express.Router();

// create
router.post("/create", verifyMerchantToken, createTransaction);
router.get("/fetch", verifyToken, getTodaysTransaction);
router.get("/fetchbydate", verifyToken, getTransactionByDate);

module.exports = router;
