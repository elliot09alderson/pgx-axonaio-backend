var express = require("express");
const {
  verifyResellerToken,
  verifyResellerAdminToken,
} = require("../middleware/authorization");
const { pdfUpload } = require("../utils/fileUploadUtil");
const multer = require("multer");
let upload = multer({ storage: pdfUpload("/uploads") });
const {
  createReseller,
  createMerchant,
  getAllMerchantsByRAId,
  getTodaysPayinTransaction,
  getAllResellersByRAId,
  // getTodaysPayinTransactionOfResellers,
  getAllMerchantsOfReseller,
  toggleActivateMerchant,
  toggleActivateReseller,
  getTodaysPayinTransactionByDate,
  getTodaysTransfer,
  getTodaysTransferByDate,
  getTodaysFundStatement,
  getFundStatementByDate,
} = require("./resellerAdminController");
var router = express.Router();

// MERCHANT-OPERATION

router.post(
  "/ra-merchants/create",
  verifyResellerAdminToken,
  upload.fields([
    { name: "panAttachment", maxCount: 1 },
    { name: "cancelledChequeAttachment", maxCount: 1 },
    { name: "aadharVoterIdPassportAttachment", maxCount: 1 },
  ]),
  createMerchant //working
);

router.post(
  "/ra-resellers/create",
  verifyResellerAdminToken,
  upload.fields([
    { name: "panAttachment", maxCount: 1 },
    { name: "cancelledChequeAttachment", maxCount: 1 },
    { name: "aadharVoterIdPassportAttachment", maxCount: 1 },
  ]),
  createReseller //working
);

/* -------------------------------------------------------------------------- */
/*                                      fetch 👇                            */
/* -------------------------------------------------------------------------- */

router.get(
  "/ra-merchants/fetch",
  verifyResellerAdminToken,
  getAllMerchantsByRAId //working
);
router.get(
  "/ra-resellers/fetch",
  verifyResellerAdminToken,
  getAllResellersByRAId //working
);
router.get(
  "/ra-merchants/:rid",
  verifyResellerAdminToken,
  getAllMerchantsOfReseller
);

/* -------------------------------------------------------------------------- */
/*                     activarte / deactivate   👇                            */
/* -------------------------------------------------------------------------- */

router.put(
  "/ra-merchants/toggle-account/:id",
  verifyResellerAdminToken,
  toggleActivateMerchant
);
router.put(
  "/ra-resellers/toggle-account/:id",
  verifyResellerAdminToken,
  toggleActivateReseller
);

/* -------------------------------------------------------------------------- */
/*                         fetch Transactions   👇                            */
/* -------------------------------------------------------------------------- */

router.get(
  "/get_transaction_by_ra/:id",
  verifyResellerAdminToken,
  getTodaysPayinTransaction
);
router.get(
  "/get_transaction_by_ra_date/:id",
  verifyResellerAdminToken,
  getTodaysPayinTransactionByDate
);
/* -------------------------------------------------------------------------- */
/*                         fetch Transfers   👇                            */
/* -------------------------------------------------------------------------- */

router.get(
  "/get_transfer_by_ra/:id",
  verifyResellerAdminToken,
  getTodaysTransfer
);
router.get(
  "/get_transfer_by_ra_date/:id",
  verifyResellerAdminToken,
  getTodaysTransferByDate
);

/* -------------------------------------------------------------------------- */
/*                         fetch fundstatements   👇                            */
/* -------------------------------------------------------------------------- */

router.get(
  "/get_fundstatement_by_ra/:id",
  verifyResellerAdminToken,
  getTodaysFundStatement
);
router.get(
  "/get_fundstatement_by_ra_date/:id",
  verifyResellerAdminToken,
  getFundStatementByDate
);

// RESELLER-OPERATION

router.post("/create_reseller", verifyResellerAdminToken, createReseller);
router.get(
  "/getreseller_merchants/:",
  verifyResellerAdminToken,
  getAllMerchantsOfReseller
);

router.get("/get_resellers", verifyResellerAdminToken, getAllResellersByRAId);
// router.get(
//   "/get_transaction/:id",
//   verifyResellerAdminToken,
//   getTodaysPayinTransactionOfResellers
// );

module.exports = router;
