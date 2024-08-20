const router = require('express').Router();
const { multerStorage } = require("../utils/fileUploadUtil");
const multer = require("multer");
const { documentFileCreate, merchantOnboardBySelf, fetchUserDocDetails,  } = require('../controllers/merchantOnboardController');
const { verifyToken } = require('../middleware/authorization');
let upload = multer({ storage: multerStorage("/images") });

// router.post('/file-create', upload.single('document'), documentFileCreate);

router.put(
    "/create", 
    verifyToken, 
    upload.fields([
      { name: "panAttachment", maxCount: 1 },
      { name: "cancelledChequeAttachment", maxCount: 1 },
      { name: "aadharVoterIdPassportAttachment", maxCount: 1 }
    ]), 
    // console.log("crossing 1"),
    merchantOnboardBySelf);
router.get('/fetch', verifyToken, fetchUserDocDetails)

module.exports = router