var express = require("express");
const {
  createLiveWebhook,
  getAllWebhook,
  updateWehook,
} = require("../controllers/liveWebhookController");
const { verifyToken } = require("../middleware/authorization");
const { body } = require("express-validator");
var router = express.Router();

// create
router.post("/create", verifyToken, createLiveWebhook);
router.get("/fetch", verifyToken, getAllWebhook);
router.put("/update", verifyToken, updateWehook);

module.exports = router;
