// token schema
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SublinkSchema = new Schema(
  {
    sublinkName: {
      type: String,
    },
    sublink: {
      type: String,
    },
    linkId: {
      type: Schema.Types.ObjectId,
    },
    appId: {
      type: Schema.Types.ObjectId,
    },
    status: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
const Sublink = mongoose.model("sublink", SublinkSchema);
module.exports = Sublink;
