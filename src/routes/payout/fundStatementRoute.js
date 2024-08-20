var express = require("express");
const {
  verifyToken,
  verifyMerchantToken,
} = require("../../middleware/authorization");

var router = express.Router();
const {
  createfundStatement,
  getTodaysfundStatement,
  getfundStatementByDate,
} = require("../../controllers/payout/fundStatementController");

router.post("/create", verifyMerchantToken, createfundStatement);
router.get("/fetch", verifyToken, getTodaysfundStatement);
router.get("/fetchbydate", verifyToken, getfundStatementByDate);

module.exports = router;
