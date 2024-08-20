var express = require("express");
const { verifyToken } = require("../../middleware/authorization");
const {
  createBeneficiary,
  get_Beneficiary,
  deleteBeneficiary,
} = require("../../controllers/payout/beneficiaryController");
var router = express.Router();

// create
router.post("/create", verifyToken, createBeneficiary);
router.get("/fetch", verifyToken, get_Beneficiary);
router.delete("/delete/:id", verifyToken, deleteBeneficiary);

module.exports = router;
