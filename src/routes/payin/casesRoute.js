var express = require("express");
const { verifyToken } = require("../../middleware/authorization");
const {
  createCase,
  getTodayCases,
  getCasesByDate,
} = require("../../controllers/payin/caseController");
var router = express.Router();

router.post("/create", verifyToken, createCase);
router.get("/fetch", verifyToken, getTodayCases);
router.get("/fetchbydate", verifyToken, getCasesByDate);

module.exports = router;
