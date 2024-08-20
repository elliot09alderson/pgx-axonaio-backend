var express = require("express");
const { verifyResellerToken } = require("../middleware/authorization");

const {
  createMerchant,
  getAllMerchantsByRId,
  getTodaysPayinTransaction,
  getPayinTransactionByDate,
  deActivateMerchant,
  getfundStatementByDate,
  getTodaysfundStatement,
  getTodaysPayOutTransfer,
  getPayOutTransferByDate,
} = require("./resellerController");
var router = express.Router();

router.post("/create", verifyResellerToken, createMerchant);
router.get("/fetch", verifyResellerToken, getAllMerchantsByRId);
router.get(
  "/get_transaction/:id",
  verifyResellerToken,
  getTodaysPayinTransaction
);
router.get(
  "/all_transaction/:id",
  verifyResellerToken,
  getPayinTransactionByDate
);
/* ----------------------------- payout transfer ---------------------------- */
router.get(
  "/get_transfer/:id",
  verifyResellerToken,
  getTodaysPayOutTransfer
);
router.get(
  "/all_transfer/:id",
  verifyResellerToken,
  getPayOutTransferByDate
);
/* ----------------------------- fund statement ----------------------------- */
router.get(
  "/get_fundstatement/:id",
  verifyResellerToken,
  getTodaysfundStatement
);
router.get(
  "/all_fundstatement/:id",
  verifyResellerToken,
  getfundStatementByDate
);
/* ----------------------------- toggle account ----------------------------- */
router.put("/toggle-account/:id", verifyResellerToken, deActivateMerchant);

module.exports = router;
