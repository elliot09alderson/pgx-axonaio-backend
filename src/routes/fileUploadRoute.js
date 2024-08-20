var express = require("express");
const { verifyToken } = require("../middleware/authorization");
const createFileUpload = require("../controllers/fileUploadController");
const { pdfUpload } = require("../utils/fileUploadUtil");
const multer = require("multer");
let upload = multer({ storage: pdfUpload("/uploads") });
var router = express.Router();

// create
router.post(
  "/create",
  (req, res, next) => {
    // Check if the file was uploaded using 'fileName' field
    upload.single("fileName")(req, res, (err) => {
      if (err && err.field === "fileName") {
        // If 'fileName' field fails, return error
        return res.status(400).json({
          error: "Invalid field name. Use 'fileName' for file upload",
        });
      } else if (err) {
        // If any other error occurs, return error
        return res.status(400).json({ error: err.message });
      } else {
        // File uploaded successfully
        next();
      }
    });
  },
  createFileUpload
);

module.exports = router;
