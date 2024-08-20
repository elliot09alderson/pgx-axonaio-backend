var express = require("express");
const {
  createAppMode,
  fetchAppMode,
} = require("../controllers/merchantAppModeController");
const { verifyToken } = require("../middleware/authorization");
var router = express.Router();

// create
router.put("/create", verifyToken, createAppMode);
router.get("/fetch", verifyToken, fetchAppMode);
module.exports = router;
