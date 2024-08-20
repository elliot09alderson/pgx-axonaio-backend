const mongoose = require("mongoose");

const fileUploadSchema = new mongoose.Schema({
  pathName: {
    type: String,
  },
  fileName: {
    type: String,
  },
  userId : {
    type: mongoose.Schema.Types.ObjectId,
    ref:"User"
  }
});

module.exports = mongoose.model("FileUpload", fileUploadSchema);
