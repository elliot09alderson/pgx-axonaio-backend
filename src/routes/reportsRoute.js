const express = require("express");
const { createReports, fetchReports } = require("../controllers/reportsController");

const { verifyToken } = require("../middleware/authorization");
const router = express.Router();

// create app
router.post("/create", verifyToken, createReports);
router.get("/fetch", verifyToken, fetchReports);

module.exports = router;
