var express = require("express");
const { verifyToken, verifyMerchantToken } = require("../../middleware/authorization");
const {
  createOrder,
  getTodaysOrders,
  getOrdersByDate,
} = require("../../controllers/payin/PayInOrderController");
var router = express.Router();

// create
router.post("/create", verifyMerchantToken, createOrder);
router.get("/fetch", verifyToken, getTodaysOrders);
router.get("/fetchbydate", verifyToken, getOrdersByDate);

module.exports = router;
