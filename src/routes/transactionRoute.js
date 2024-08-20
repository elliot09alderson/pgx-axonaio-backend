const express = require("express");
const {
  createTransaction,
  fetchTransactionsByFilter,
  fetchTransactionByAdmin,
  fetchGraphDataByAdmin,
} = require("../controllers/transactionController");
const { verifyToken } = require("../middleware/authorization");
const router = express.Router();

// create app
router.post("/create", verifyToken, createTransaction);
router.get("/fetch", verifyToken, fetchTransactionsByFilter);
router.get("/dashboard/transactionstats", fetchTransactionByAdmin);
router.get("/dashboard/dashboardGraphData", fetchGraphDataByAdmin);
module.exports = router;
