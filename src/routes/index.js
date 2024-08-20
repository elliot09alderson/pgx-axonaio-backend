var express = require("express");
const {
  addResellerMerchant,
} = require("../controllers/resellerController/ResellerManageMerchant.js");
const {
  createMerchantPricing,
} = require("../controllers/MerchantPricing/MerchantPricingController.js");
var app = express();
var router = express.Router();

/* GET home page. */

router.get("/create_merchant_pricing", createMerchantPricing);

router.post("/create_reseller_merchant", addResellerMerchant);
router.get("/test", function (req, res, next) {
  // res.render('index', { title: 'Express' })
  res.json({ message: "working fine ...", success: true });
});

app.use("/", router);

module.exports = router;
