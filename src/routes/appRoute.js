var express = require("express");
const { appCreate, fetchAllApps } = require("../controllers/appController");
var router = express.Router();
const { multerStorage } = require("../utils/fileUploadUtil");
const multer = require("multer");
const { verifyToken } = require("../middleware/authorization");
let upload = multer({ storage: multerStorage("/images") });

// create app
router.post("/create", verifyToken, upload.single("logo"), appCreate);
router.get("/fetch", verifyToken, fetchAllApps);

module.exports = router;
