const User = require("../models/user");
var CryptoJS = require("crypto-js");
const Token = require("../models/tokenSchema");
const randomstring = require("randomstring");
const sendEmailOtp = require("../utils/email/sendEmailOtp");
const otpModel = require("../models/otpModel");
const userDocDetails = require("../models/userDocDetails/userDocDetails");
const AppModel = require("../models/appModel");

const updatePassword = async (req, res) => {
  try {
    const { password } = req.query;

    console.log(password);
    const user = await User.findOne({ email: req.user.email });
    if (user) {
      let ciphertext = CryptoJS.AES.encrypt(
        password,
        process.env.REFRESH_TOKEN_SECRET
      ).toString();
      if (user.prevPassword || user.prevprevPassword) {
        let bytes = CryptoJS.AES.decrypt(
          user.password,
          process.env.REFRESH_TOKEN_SECRET
        );
        let originalText = bytes.toString(CryptoJS.enc.Utf8);
        let bytes2 = CryptoJS.AES.decrypt(
          user.prevPassword,
          process.env.REFRESH_TOKEN_SECRET
        );
        let originalText2 = bytes2.toString(CryptoJS.enc.Utf8);
        let bytes3 = CryptoJS.AES.decrypt(
          user.prevPrevPassword,
          process.env.REFRESH_TOKEN_SECRET
        );
        let originalText3 = bytes3.toString(CryptoJS.enc.Utf8);
        if (
          originalText === password ||
          originalText2 === password ||
          originalText3 === password
        ) {
          return res.status(422).json({
            error:
              "password match with previous one. please enter the new password!",
            status: false,
          });
        }
      }
      let doc = await User.findOneAndUpdate(
        { email: req.user.email },
        {
          password: ciphertext,
          prevPassword: user.password,
          prevPrevPassword: user.prevPassword,
        },
        {
          new: true,
        }
      );
      await Token.deleteMany({ userId: req.user._id });
      res.status(200).json({ status: true, data: doc });
    } else {
      res.status(422).json({ status: false, error: "invalid user!" });
    }
  } catch (error) {
    // console.log(error);
    return res.status(500).json({ status: false, error: error.message });
  }
};

const checkTokenForEmailExist = async (req, res) => {
  try {
    res.status(200).json({ status: true });
  } catch (error) {
    // console.log(error);
    return res.status(500).json({ status: false, error: error.message });
  }
};

const emailVerify = async (req, res) => {
  try {
    if (req.user) {
      let doc = await User.findOneAndUpdate(
        { email: req.user.email },
        { isEmailVerify: true },
        {
          new: true,
        }
      );
      await Token.findOneAndDelete({ userId: req.user._id });
      res.status(200).json(doc);
    } else {
      return res.status(401).json({ message: "User not found!" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: error.message });
  }
};

const getProfileDetails = async (req, res) => {
  try {
    const userData = await User.findById(req.user._id).select(
      "-password -prevPassword -prevPrevPassword"
    );
    /* -------------------------------------------------------------------------- */
    /*                        for any user who is merchant                        */
    /* -------------------------------------------------------------------------- */
    if (userData.is_merchant) {
      const docData = await userDocDetails.findOne({
        m_id: userData.m_id,
      });
      console.log("userData", userData.toObject(), docData.toObject());
      if (docData && userData) {
        const data = { ...userData.toObject(), ...docData.toObject() };
        console.log("data ====> profile", data);

        res.status(200).json({
          data,
          message: "profile fetched successfully ",
        });
      } else {
        res.status(401).json({ status: false, error: "Records not found!" });
      }
    } else if (userData.is_reseller && !userData.is_merchant) {
      /* -------------------------------------------------------------------------- */
      /*                          if user is only reseller                          */
      /* -------------------------------------------------------------------------- */
      const docData = await userDocDetails.findOne({
        r_id: userData.r_id,
      });
      console.log("userData", userData.toObject(), docData.toObject());
      if (docData && userData) {
        const data = { ...userData.toObject(), ...docData.toObject() };
        console.log("data ====> profile", data);

        res.status(200).json({
          data,
          message: "profile fetched successfully ",
        });
      } else {
        res.status(401).json({ status: false, error: "Records not found!" });
      }
    } else if (
      /* -------------------------------------------------------------------------- */
      /*                          if user is only reseller_User                          */
      /* -------------------------------------------------------------------------- */
      !userData.is_reseller &&
      !userData.is_merchant &&
      userData.is_reseller_User
    ) {
      const docData = await userDocDetails.findOne({
        ra_id: userData.ra_id,
      });

      if (docData && userData) {
        const data = { ...userData.toObject(), ...docData.toObject() };
        console.log("data ====> profile", data);

        res.status(200).json({
          data,
          message: "profile fetched successfully ",
        });
      } else {
        res.status(401).json({ status: false, error: "Records not found!" });
      }
    }
  } catch (error) {
    // console.log(error);
    return res.status(500).json({ status: false, error: error.message });
  }
};

const logoutFromSite = async (req, res) => {
  try {
    const tokenData = await Token.findOneAndDelete({ userId: req.user._id });
    if (tokenData) {
      res.status(200).json({ message: "logout has successfully done!" });
    } else {
      res.status(200).json({ message: "data is not found!" });
    }
  } catch (error) {
    // console.log(error);
    return res.status(500).json({ status: false, error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { app_mode } = req.query;
    const data = await User.findById(req.user._id);
    if (data) {
      await User.updateOne({ _id: req.user._id }, { app_mode });
      res.status(200).json({
        result: true,
        message: "updated successfully!",
        isBasic: data.isBasic,
        app_mode: app_mode,
        bg_verified: data.bg_verified,
      });
    } else {
      res.status(404).json({
        status: false,
        error: "data is not found!",
      });
    }
  } catch (error) {
    // console.log(error);
    return res.status(500).json({ status: false, error: error.message });
  }
};

// Generate OTP
function generateOTP() {
  return randomstring.generate({
    length: 6,
    charset: "numeric",
  });
}

// Send OTP to the provided email without expiration time
// const sendOTP = async (req, res) => {
//     try {
//         const { email } = req.body;
//         const otp = generateOTP(); // Generate a 6-digit OTP
//         const newOTP = new otpModel({ email, otp });
//         await newOTP.save();

//         // Send OTP via email
//         await sendEmailOtp({
//             to: email,
//             subject: "Your One-Time Password (OTP)",
//     message: `
//         <p>Dear User,</p>
//         <p>Your One-Time Password (OTP) is:  <strong>${otp}</strong> </p>
//         <p>Please use this OTP to proceed with your authentication process.</p>
//         <p>If you did not request this OTP, please disregard this email.</p>
//         <br>
//         <p>Best Regards,</p>
//         <p>Axon-Tech</p>
//     `
//         });

//         res.status(200).json({ success: true, message: 'OTP sent successfully' });
//     } catch (error) {
//         console.error('Error sending OTP:', error);
//         res.status(500).json({ success: false, error: 'Internal server error' });
//     }
// };

// Verify OTP provided by the user without expiration time
// const verifyOTP = async (req, res) => {
//     try {
//         const { email, otp } = req.body;
//         if(!email || !otp){return res.status(400).json({success: false, error: 'Please enter the otp & email'})}
//         const existingOTP = await otpModel.findOneAndDelete({ email, otp });

//         if (existingOTP) {
//             // OTP is valid
//             res.status(200).json({ success: true, message: 'OTP verification successful' });
//         } else {
//             // OTP is invalid
//             res.status(400).json({ success: false, error: 'Invalid OTP' });
//         }
//     } catch (error) {
//         console.error('Error verifying OTP:', error);
//         res.status(500).json({ success: false, error: 'Internal server error' });
//     }
// };

//  WITH EXPIRATION TIME
const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const otp = generateOTP(); // Generate a 6-digit OTP
    const newOTP = new otpModel({ email, otp });
    await newOTP.save();

    // Send OTP via email
    await sendEmailOtp({
      to: email,
      subject: "Your One-Time Password (OTP)",
      message: `
        <p>Dear User,</p>
        <p>Your One-Time Password (OTP) is:  <strong>${otp}</strong> </p>
        <p>Please use this OTP to proceed with your authentication process.</p>
        <p>If you did not request this OTP, please disregard this email.</p>
        <br>
        <p>Best Regards,</p>
        <p>Axon-Tech</p>
    `,
    });

    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// with expiration time
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res
        .status(400)
        .json({ success: false, error: "Please enter the otp & email" });
    }
    const existingOTP = await otpModel.findOneAndDelete({ email, otp });

    if (existingOTP) {
      // OTP is valid
      res
        .status(200)
        .json({ success: true, message: "OTP verification successful" });
    } else {
      // OTP is invalid
      res.status(400).json({ success: false, error: "Invalid OTP" });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

/* ----------------- MERCHANTS TOGGLE FOR LIVE AND TEST MODE ---------------- */

const toggleForMode = async (req, res) => {
  try {
    const merchantId = req.user.m_id;
    console.log(merchantId);

    // Find the merchant by ID
    const merchant = await User.findOne({ m_id: merchantId });

    if (!merchant) {
      return res.status(404).json({
        status: false,
        error: "No records found",
      });
    }

    /* -------------- check that merchant is allowed for live mode or not -------------- */
    if (!merchant.change_app_mode) {
      return res.status(403).json({
        status: false,
        error:
          "Access Denied: You do not have the required permissions to switch to live mode at this time. Please contact support for further assistance.",
      });
    }

    // Toggle the app_mode status between "test" and "live"
    const newStatus = merchant.app_mode === "test" ? "live" : "test";
    await User.updateOne(
      { m_id: merchantId },
      { $set: { app_mode: newStatus } }
    );

    return res.status(200).json({
      status: true,
      message: `${merchant.name} has been successfully switched to ${newStatus} mode.`,
    });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};

/* ---------------------- CHECK APP PERMISSION APP WISE --------------------- */

// const checkAppPermissionForMerchant = async (req, res) => {
//   try {
//     const { merchantId } = req.params;
//     const { appId } = req.body;

//     // Validate input
//     if (!merchantId || !appId) {
//       return res.status(400).json({ status: false, error: "Please fill all the details" });
//     }

//     // Find the user by merchantId
//     const user = await User.findOne({ m_id: merchantId }).populate('app_permissions');

//     if (!user) {
//       return res.status(404).json({ status: false, error: "Merchant not found" });
//     }

//     // Check if appId exists in app_permissions
//     const hasPermission = user.app_permissions.some(permission => permission._id.toString() === appId);

//     if (hasPermission) {
//       // If the appId is found in the merchant's permissions, check the status of the app
//       const app = await AppModel.findOne({ _id: appId, status: 'active' });

//       if (app) {
//         return res.status(200).json({
//           status: true,
//           message: `Merchant has access to the requested app.`,
//         });
//       } else {
//         return res.status(403).json({
//           status: false,
//           error: "Merchant does not have permission for the requested app as it is inactive.",
//         });
//       }
//     } else {
//       return res.status(403).json({
//         status: false,
//         error: "Merchant does not have permission for the requested app.",
//       });
//     }
//   } catch (error) {
//     return res.status(500).json({
//       status: false,
//       error: error.message,
//     });
//   }
// };

const fetch_apps = async (req, res) => {
  try {
    const apps = await AppModel.find(); // Populate added_by with fields like name, email
    res.status(200).json({ status: true, data: apps });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  updatePassword,
  checkTokenForEmailExist,
  emailVerify,
  getProfileDetails,
  logoutFromSite,
  updateProfile,
  sendOTP,
  verifyOTP,
  toggleForMode,
  // checkAppPermissionForMerchant,
  fetch_apps,
};
