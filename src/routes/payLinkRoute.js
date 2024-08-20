const {
  payLinkCreate,
  payLinkFetch,
  fetchPaylinkByUrl,
  updatePaylinkData
} = require("../controllers/payLinkController");
const { verifyToken } = require("../middleware/authorization");

const router = require("express").Router();

router.post("/create", verifyToken, payLinkCreate);
router.get("/fetch", verifyToken, payLinkFetch);
router.get("/fetch/url", verifyToken, fetchPaylinkByUrl);
router.patch("/update", verifyToken, updatePaylinkData);
module.exports = router;
