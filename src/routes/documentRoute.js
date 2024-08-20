const router = require('express').Router();
const { multerStorage } = require("../utils/fileUploadUtil");
const multer = require("multer");
const { documentFileCreate, documentCreate, documentFetch } = require('../controllers/documentController');
const { verifyToken } = require('../middleware/authorization');
let upload = multer({ storage: multerStorage("/images") });

router.post('/file-create', upload.single('document'), documentFileCreate);

router.put("/create", verifyToken, documentCreate);
router.get('/fetch', verifyToken, documentFetch)

module.exports = router