const express = require("express");
const {
  createSettlement,
  fetchSettlementByFilter,
} = require("../controllers/settlementController");

const { verifyToken } = require("../middleware/authorization");
const router = express.Router();

// create app
router.post("/create", verifyToken, createSettlement);
router.get("/fetch", verifyToken, fetchSettlementByFilter);

module.exports = router;
