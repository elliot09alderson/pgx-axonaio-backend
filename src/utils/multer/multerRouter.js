const express = require("express");
const multerRouter = express.Router();

// Upload a file for a specific merchant
multerRouter.post("/merchant_doc/:id/upload", upload.single("file"), (req, res) => {
  const merchantId = req.params.id;
  const file = req.file; // Uploaded file

  // Logic to save file details in database associated with merchantId
  // ...

  res.json({ success: true, message: "File uploaded successfully" });
});

module.exports = multerRouter;


// Retrieve files for a specific merchant
router.get('/merchant/:id/files', (req, res) => {
    const merchantId = req.params.id;
  
    // Logic to fetch files associated with merchantId from database
    // ...
  
    // Send file details as response
    res.json({ files: /* Array of file details */ });
  });
  