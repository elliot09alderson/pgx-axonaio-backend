const { orderCreate, fetchOrderd, upiCheck } = require("../controllers/orderController");
const { verifyToken } = require("../middleware/authorization");

const router = require("express").Router();

router.post("/create", verifyToken, orderCreate);
router.get("/fetch", verifyToken, fetchOrderd);

router.get('/upi-check', upiCheck);
module.exports = router;
