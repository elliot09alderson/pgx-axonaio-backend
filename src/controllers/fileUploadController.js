const fileUpload = require("../models/filUploadSchema");
// Example route handler for file upload
const createFileUpload = async (req, res) => {
  try {
    // Try to upload the file
    const saveFile = await fileUpload.create({
      pathName: req.file.path,
      fileName: req.file.filename,
      userId: req.user._id
    });
    // File upload successful
    res
      .status(201)
      .json({ message: "File uploaded successfully", data: saveFile });
  } catch (err) {
    // Handle upload errors
    res.status(500).json({ error: err.message });
  }
};

module.exports = createFileUpload;
