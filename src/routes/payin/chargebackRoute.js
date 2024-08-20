var express = require("express");
const {
  createChargeback,

  getTodaysChargeback,
  getChargebackByDate,
} = require("../../controllers/payin/PayInchargebackController");
const { verifyToken } = require("../../middleware/authorization");
const { body } = require("express-validator");
var router = express.Router();

// Validate request body
const chargebackValidationRules = [
  body("transaction_id").notEmpty().withMessage("Transaction GID is required"),
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
];

// create
router.post(
  "/create",
  verifyToken,
  chargebackValidationRules,
  createChargeback
);
// router.post("/bulk", insertBulkChargeback);
router.get("/fetch", verifyToken, getTodaysChargeback);
router.get("/fetchbydate", verifyToken, getChargebackByDate);

module.exports = router;
