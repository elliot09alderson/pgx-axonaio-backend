var express = require("express");

const {
  createReseller,
  convertMerchantToReseller,
  convertMerchantToResellerAdmin,
  createResellerAdmin,
} = require("./adminConroller");
var AdminRouter = express.Router();

// MERCHANT-OPERATION

AdminRouter.post("/create_reseller", createReseller);
AdminRouter.post(
  "/convert_to_resellerAdmin/:m_id",
  convertMerchantToResellerAdmin
);
AdminRouter.post("/convert_to_reseller/:m_id", convertMerchantToReseller);
AdminRouter.post("/create", createResellerAdmin);

module.exports = AdminRouter;
