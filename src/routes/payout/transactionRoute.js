var express = require("express");
const { verifyToken } = require("../../middleware/authorization");
const {
  createTransfer,
  getTodaysTransfer,
  getTransferByDate,
} = require("../../controllers/payout/transferController");
var router = express.Router();

// create
router.post("/create", verifyToken, createTransfer);
router.get("/fetch", verifyToken, getTodaysTransfer);
router.get("/fetchbydate", verifyToken, getTransferByDate);

module.exports = router;
