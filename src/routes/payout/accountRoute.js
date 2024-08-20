var express = require("express");
const { verifyToken } = require("../../middleware/authorization");
const { createaccount, get_account, updateaccount, deleteaccount } = require("../../controllers/payout/accountController");
var router = express.Router();

router.post("/create", verifyToken, createaccount);
router.get("/fetch", verifyToken, get_account);
router.put("/update/:id", verifyToken, updateaccount);
router.delete("/delete/:id", verifyToken, deleteaccount);

module.exports = router;
