var express = require("express");
const { verifyToken } = require("../../middleware/authorization");
const {
  generateApiKeys,
  get_apiKey,
} = require("../../controllers/payin/apiKeyController");
var router = express.Router();

router.put("/create", verifyToken, generateApiKeys);
router.get("/fetch", verifyToken, get_apiKey);

module.exports = router;
