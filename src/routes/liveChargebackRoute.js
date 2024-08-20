var express = require("express");
const {
  createLiveChargeback,
  getAllChargeback,
  updateChargeback,
} = require("../controllers/liveChargebackController");
const { verifyToken } = require("../middleware/authorization");
const { body } = require("express-validator");
var router = express.Router();

// Validate request body
const chargebackValidationRules = [
  body("chargeback_gid").notEmpty().withMessage("Chargeback GID is required"),
  body("transaction_gid").notEmpty().withMessage("Transaction GID is required"),
  body("chargeback_amount")
    .isNumeric()
    .withMessage("Chargeback amount must be numeric"),
  body("chargeback_type")
    .isIn([
      "retrieval",
      "chargeback",
      "pre_arbitration",
      "arbitration",
      "fraud",
    ])
    .withMessage("Invalid chargeback type"),
  body("chargeback_status")
    .isIn([
      "open",
      "under_review",
      "lost",
      "won",
      "closed",
      "processed",
      "processing",
    ])
    .withMessage("Invalid chargeback status"),
  body("chargeback_respond")
    .optional()
    .isString()
    .withMessage("Chargeback response must be a string"),
  body("user_id").isNumeric().withMessage("User ID must be numeric"),
];

// create
router.post(
  "/create",
  verifyToken,
  chargebackValidationRules,
  createLiveChargeback
);
router.get("/fetch", getAllChargeback);
router.put("/update", verifyToken, chargebackValidationRules, updateChargeback);

module.exports = router;
