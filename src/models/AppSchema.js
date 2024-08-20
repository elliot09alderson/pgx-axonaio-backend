const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AppSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "category",
    },
    status: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: Schema.Types.ObjectId,
    },
    description: {
      type: String,
      required: true,
    },
    mode: {
      type: String,
      enum: ["test", "live"],
      default: "test",
    },
    logo: {
      type: String,
    },
  },
  { timestamps: true }
);

const Apps = mongoose.model("apps", AppSchema);

module.exports = Apps;
