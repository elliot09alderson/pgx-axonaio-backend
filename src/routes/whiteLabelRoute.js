const router = require("express").Router();

const {
  CreatelogTable,
  createWhiteLabel,
} = require("../controllers/whiteLabelController");
const { multerStorage } = require("../utils/fileUploadUtil");
const multer = require("multer");
let upload = multer({ storage: multerStorage("/images") });

// domain fetch
router.post("/create", upload.single("logo"), createWhiteLabel);

// system informmation store for each user
router.post("/system-information", CreatelogTable);

module.exports = router; 
 