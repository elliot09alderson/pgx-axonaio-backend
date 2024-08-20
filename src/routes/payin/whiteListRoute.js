var express = require("express");
const { verifyToken } = require("../../middleware/authorization");
const {
  createWhitelist,
  getAllWhitelist,
  updateWhiteList,
  deleteWhitelist,
} = require("../../controllers/payin/whitelistController");

var router = express.Router();

router.post("/create", verifyToken, createWhitelist);
router.get("/fetch", verifyToken, getAllWhitelist);
router.put("/update/:id", verifyToken, updateWhiteList);
router.delete("/delete/:id", verifyToken, deleteWhitelist);

module.exports = router;
