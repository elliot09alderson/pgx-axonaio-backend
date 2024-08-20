const e = require("express");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = Schema(
  {
    name: {
      type: String,
      required: true,
    },
    is_reseller: {
      type: Boolean,
      default: false,
    },
    is_merchant: {
      type: Boolean,
      default: false,
    },
    is_reseller_admin: {
      type: Boolean,
      default: false,
    },
    is_active: {
      type: Boolean,
      default: false,
    },

    m_id: String,
    r_id: String,
    ra_id: String,

    resellers_merchant: [{ type: Schema.Types.ObjectId, ref: "User" }],

    /* -------------------------------------------------------------------------- */
    /*                         if i am reseller_admin
     */
    my_resellers: [{ type: Schema.Types.ObjectId, ref: "User" }],

    /* -------------------------------------------------------------------------- */

    reseller_admins_merchant: [{ type: Schema.Types.ObjectId, ref: "User" }],

    app_permissions: {
      type: [String],
    },

    phonenumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    prevPassword: {
      type: String,
      default: "",
    },
    prevPrevPassword: {
      type: String,
      default: "",
    },
    attempt: {
      type: Number,
      default: 0,
    },
    isAccess: {
      type: Boolean,
      default: false,
    },
    isEmailVerify: {
      type: Boolean,
      default: false,
    },
    isBasic: {
      type: Boolean,
      default: false,
    },
    merchant_business: {
      type: Boolean,
      default: false,
    },
    app_mode: {
      type: String,
      enum: ["test", "live"],
      default: "test",
    },

    app_permissions: [
      {
        type: String,

        // Replace 'AppModel' with the actual name of the model you're referencing
      },
    ],
    documents_upload: {
      type: Boolean,
      default: false,
    },
    bg_verified: {
      type: Boolean,
      default: false,
    },
    doc_verified: {
      type: Boolean,
      default: false,
    },
    change_app_mode: {
      type: Boolean,
      default: false,
    },
    create_user_enabled: {
      type: Boolean,
      default: false,
    },
    charge_enabled: {
      type: Boolean,
      default: false,
    },
    is_account_locked: {
      type: Boolean,
      default: false,
    },
    merchant_status: {
      type: Boolean,
      default: false,
    },
    userType: { type: String, default: "merchant" },
  },
  {
    timestamps: true,
  }
);

var User = (module.exports = mongoose.model("User", UserSchema));

// Create User
module.exports.createUser = async (newUser) => {
  try {
    const user = await User.create(newUser);
    if (user) return { data: user, status: true, msg: "user created" };
  } catch (err) {
    if (err.toString().includes("E11000 duplicate key error collection")) {
      {
        return { data: "Duplicate User", status: false };
      }
    }
  }
  return { data: null, status: false };
};

// User Login
module.exports.loginUser = async (email) => {
  var user = 1;
  try {
    user = await User.findOne({ email });
  } catch (err) {
    console.log(err);
  }
  if (user) {
    // console.log(user);
    return { data: user, status: true };
  }
  return { data: "Not successful", status: false };
};

module.exports.findByUserId = async (userId) => {
  var user = null;
  try {
    user = await User.findOne({ userId: userId });
  } catch (err) {
    console.log(err);
  }
  if (user) {
    return { data: user, status: true };
  }
  return { data: "Not successful", status: false };
};

module.exports = User;
