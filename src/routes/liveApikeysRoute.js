var express = require("express");
const {
  createPgApikeys,
  getAllApiKeys,
} = require("../controllers/livePgApikeysController");
const { verifyToken } = require("../middleware/authorization");
const { body } = require("express-validator");
var router = express.Router();

// create
router.post("/create", verifyToken, createPgApikeys);
router.get("/fetch", verifyToken, getAllApiKeys);

module.exports = router;
