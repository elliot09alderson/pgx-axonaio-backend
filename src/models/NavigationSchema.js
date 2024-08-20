// token schema
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NavigationSchema = new Schema(
  {
    linkName: {
      type: String,
    },
    link: {
      type: String,
    },
    app_id: {
      type: Schema.Types.ObjectId,
    },
    hyperLink: {
      type: String,
    },
    status: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
const Navigation = mongoose.model("navigation", NavigationSchema);
module.exports = Navigation;
