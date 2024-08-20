var express = require("express");
const { verifyToken } = require("../../middleware/authorization");
const {
  createRefund,
  get_Refund,
  deleteRefund,
  updateRefund,
  getRefundByDate,
} = require("../../controllers/payin/refundController");
var router = express.Router();

// create
router.post("/create", verifyToken, createRefund);
router.get("/fetch", verifyToken, get_Refund);
router.get("/fetchbydate", verifyToken, getRefundByDate);


// bcs the refund status can update reseller admin or admin(as of my knowledge by CG)


// router.put("/update/:id", verifyToken, updaterefund);
// router.delete("/delete/:id", verifyToken, deleterefund);

module.exports = router;
