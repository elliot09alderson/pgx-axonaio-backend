var express = require("express");
var router = express.Router();
const User = require("../models/user");
const session = require("express-session");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");
const { createJwt } = require("../utils/jwt_token");
var CryptoJS = require("crypto-js");
const uaParser = require("ua-parser-js");
const requestIp = require("request-ip");
const geoip = require("geoip-lite");
const app = express();
const userModel = require("../models/user");
const BusinessDetails = require("../models/businessdetails");
const DocumentDetails = require("../models/documentsDetails");
const BankingDetails = require("../models/bankdetails");
const userDocModel = require("../models/userDocDetails/userDocDetails");
const fileUpload = require("../models/filUploadSchema");
const { pdfUpload } = require("../utils/fileUploadUtil");
const multer = require("multer");
let upload = multer({ storage: pdfUpload("/uploads") });

// Middleware to get client IP address
app.use(requestIp.mw());
const {
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
} = require("../controllers/userController");
const sendEmail = require("../utils/email/sendEmail");
const Token = require("../models/tokenSchema");
const logsDetails = require("../models/userLoginActivity");
const { tokenVerify } = require("../middleware/tokenVerify");
const {
  verifyToken,
  verifyResellerToken,
} = require("../middleware/authorization");

// FUNCTION FOR GENERATE MERCHANTID
function generateMerchantId() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const minLength = 18;
  const maxLength = 24;
  const length =
    Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
  let merchantId = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    merchantId += characters.charAt(randomIndex);
  }

  return merchantId;
}

router.get("/", (req, res, next) => {
  config;
  console.log("Api running");
  res.status(200).json("Api is Running");
});

router.post("/sendotp", sendOTP);
router.post("/verifyotp", verifyOTP);

/* ---------------------- TOGGLE FOR TEST AND LIVE MODE --------------------- */
router.put("/toggle_mode", verifyToken, toggleForMode);
// router.put("/check_app_permissions/:merchantId", verifyToken, checkAppPermissionForMerchant);
router.get("/fetch_apps", verifyToken, fetch_apps);

router.post("/signup", async function (req, res) {
  try {
    // Extract password from request body
    const password = req.body.password;

    // Encrypt the password using AES encryption
    const ciphertext = CryptoJS.AES.encrypt(
      password,
      process.env.REFRESH_TOKEN_SECRET
    ).toString();

    // Create user with encrypted password
    const userData = await User.createUser({
      name: req.body.name,
      phonenumber: req.body.phonenumber,
      password: ciphertext,
      email: String(req.body.email).toLowerCase(),
      prevPassword: ciphertext, // Is this intended? It seems redundant
      m_id: generateMerchantId(),
      is_merchant: true,
      is_active: true,
    });

    if (userData.status) {
      // Generate JWT token
      const generateToken = await createJwt(
        req.body.email,
        userData.data._id.toString()
      );

      // Save token to database
      const tokenData = new Token({
        userId: userData.data._id.toString(),
        token: generateToken,
      });
      await tokenData.save();

      // Construct email verification link
      const welcomeLink = `${process.env.FRONTEND_URL}/axonaio/user/email-verification?token=${generateToken}`;

      // Send verification email
      await sendEmail(
        req.body.email,
        "Verify your email",
        { name: userData.data.name, link: welcomeLink },
        "./template/welcome.handlebars"
      );

      // Send success response
      return res
        .status(200)
        .json({ message: "Created successfully", result: true });
    } else if (
      userData.data != null &&
      userData.data.includes("Duplicate User")
    ) {
      // If user already exists, send appropriate response
      return res.status(409).json({ message: userData.data, status: false });
    }
  } catch (err) {
    // Handle errors
    console.error("Error during signup:", err);
    return res
      .status(500)
      .json({ message: "Internal server error", status: false });
  }
});

/* User Login Api */

router.post("/login", async function (req, res) {
  try {
    const userData = await User.loginUser(req.body.email);
    if (userData.status) {
      if (userData.data?.isEmailVerify) {
        if (userData.data.is_active) {
          if (userData.data.isAccess) {
            return res.status(400).json({
              Error: "please contact with admin to change your password!",
              status: false,
            });
          }

          var bytes = CryptoJS.AES.decrypt(
            userData.data.password,
            process.env.REFRESH_TOKEN_SECRET
          );
          var originalText = bytes.toString(CryptoJS.enc.Utf8);
          var token = null;
          try {
            const checkUserType = await User.findOne({ email: req.body.email });

            /* -------------------------------------------------------------------------- */
            /*                          // RESELLER LOGIN                                */
            /* -------------------------------------------------------------------------- */

            if (checkUserType.is_reseller) {
              token = createJwt(req.body.email, userData.data.r_id, "reseller");
              // console.log("my token", token);
              if (req.body.password === originalText) {
                ///creating session variable to store the m_id to make this one reseller later
                const r_id = userData.data.r_id;
                // -----------------------------------------------------------------
                req.session.r_id = r_id;

                // creating token
                const tokenData = new Token({
                  userId: userData.data.r_id,
                  token: token,
                });
                // console.log("RESELLERtoken", tokenData);
                await tokenData.save();
                // creating logsDetails

                const ip =
                  req.headers["x-forwarded-for"] ||
                  req.connection.remoteAddress;

                // Extract user agent string
                const userAgentString = req.headers["user-agent"];
                const userAgent = uaParser(userAgentString);

                // Determine client's location based on IP address
                const estimatedLocation = getEstimatedLocation(ip);

                // Save log entry
                // console.log("hello");
                const log = new logsDetails({
                  log_ipaddress: ip,
                  log_device: estimatedLocation,
                  log_os: userAgent.os.name || "postman",
                  log_browser: userAgent.browser.name || "postman",
                  user_id: userData.data.r_id,
                });

                await log.save();
                console.log(userData.data);
                return res.status(200).json({
                  message: "Login successfully",
                  result: true,
                  token: token,
                  app_permissions: userData.data.app_permissions,
                  isBasic: userData.data.isBasic,
                  change_app_mode: userData.data.change_app_mode,
                  app_mode: userData.data.app_mode,
                  bg_verified: userData.data.bg_verified,
                  is_reseller: userData.data.is_reseller,
                  is_merchant: userData.data.is_merchant,
                  is_reseller_admin: userData.data.is_reseller_admin,
                  r_id: userData.data.r_id,
                  ra_id: userData.data.ra_id,
                  m_id: userData.data.m_id,
                });
              } else {
                userData.data.attempt += 1;
                if (3 - userData.data.attempt === 0) {
                  userData.data.isAccess = true;
                  userData.data.is_account_locked = true;

                  // res.redirect(`${process.env.FRONTEND_URL}/`);
                }
                await userData.data.save();
                return res.status(401).json({
                  message:
                    userData.data.attempt === 3
                      ? `please contacts with admin to change your password!`
                      : `You have ${3 - userData.data.attempt} attempt left`,
                  status: false,
                });
              }
            } else if (checkUserType.is_reseller_admin) {
              /* ----------------------------- RESELLER-ADMIN LOGIN ----------------------------- */
              /* -------------------------------------------------------------------------- */
              /*                             for reseller_admin                             */
              /* -------------------------------------------------------------------------- */
              token = createJwt(
                req.body.email,
                userData.data.ra_id,
                "reseller_admin"
              );
              if (req.body.password === originalText) {
                //creating session variable to store the m_id to make this one reseller later
                // console.log("RESELLER Admin DATA", userData);

                const ra_id = userData.data.ra_id;
                // -----------------------------------------------------------------
                req.session.ra_id = ra_id;

                // creating token
                const tokenData = new Token({
                  userId: userData.data.ra_id,
                  token: token,
                });
                // console.log("RESELLERAdmintoken", tokenData);
                await tokenData.save();
                // creating logsDetails

                const ip =
                  req.headers["x-forwarded-for"] ||
                  req.connection.remoteAddress;

                // Extract user agent string
                const userAgentString = req.headers["user-agent"];
                const userAgent = uaParser(userAgentString);

                // Determine client's location based on IP address
                const estimatedLocation = getEstimatedLocation(ip);

                // Save log entry
                // console.log("hello");
                const log = new logsDetails({
                  log_ipaddress: ip,
                  log_device: estimatedLocation,
                  log_os: userAgent.os.name || "postman",
                  log_browser: userAgent.browser.name || "postman",
                  user_id: userData.data.ra_id,
                });

                await log.save();
                return res.status(200).json({
                  message: "Login successfully",
                  result: true,
                  token: token,
                  isBasic: userData.data.isBasic,
                  app_mode: userData.data.app_mode,
                  change_app_mode: userData.data.change_app_mode,
                  bg_verified: userData.data.bg_verified,
                  is_reseller: userData.data.is_reseller,
                  is_merchant: userData.data.is_merchant,
                  app_permissions: userData.data.app_permissions,
                  is_reseller_admin: userData.data.is_reseller_admin,
                  r_id: userData.data.r_id,
                  ra_id: userData.data.ra_id,
                  m_id: userData.data.m_id,
                });
              } else {
                userData.data.attempt += 1;
                if (3 - userData.data.attempt === 0) {
                  userData.data.isAccess = true;
                  userData.data.is_account_locked = true;

                  // res.redirect(`${process.env.FRONTEND_URL}/`);
                }
                await userData.data.save();
                return res.status(401).json({
                  message:
                    userData.data.attempt === 3
                      ? `please contacts with admin to change your password!`
                      : `You have ${3 - userData.data.attempt} attempt left`,
                  status: false,
                });
              }
            } else {
              /* ----------------------------- MERCHANT LOGIN ----------------------------- */
              token = createJwt(req.body.email, userData.data.m_id, "merchant");
              if (req.body.password === originalText) {
                ///creating session variable to store the m_id to make this one reseller later
                const m_id = userData.data.m_id;
                // -----------------------------------------------------------------
                // req.session.m_id = m_id;

                // creating token
                const tokenData = new Token({
                  userId: m_id,
                  token: token,
                });
                await tokenData.save();
                // creating logsDetails

                const ip =
                  req.headers["x-forwarded-for"] ||
                  req.connection.remoteAddress;

                // Extract user agent string
                const userAgentString = req.headers["user-agent"];
                const userAgent = uaParser(userAgentString);

                // Determine client's location based on IP address
                const estimatedLocation = getEstimatedLocation(ip);

                // Save log entry
                // console.log("hello");
                const log = new logsDetails({
                  log_ipaddress: ip,
                  log_device: estimatedLocation,
                  log_os: userAgent.os.name || "postman",
                  log_browser: userAgent.browser.name || "postman",
                  user_id: userData.data.m_id,
                });

                await log.save();
                return res.status(200).json({
                  message: "Login successfully",
                  result: true,
                  token: token,
                  isBasic: userData.data.isBasic,
                  app_mode: userData.data.app_mode,
                  change_app_mode: userData.data.change_app_mode,
                  bg_verified: userData.data.bg_verified,
                  is_reseller: userData.data.is_reseller,
                  is_merchant: userData.data.is_merchant,
                  is_reseller_admin: userData.data.is_reseller_admin,
                  app_permissions: userData.data.app_permissions,
                  r_id: userData.data.r_id,
                  ra_id: userData.data.ra_id,
                  m_id: userData.data.m_id,
                });
              } else {
                userData.data.attempt += 1;
                if (3 - userData.data.attempt === 0) {
                  userData.data.isAccess = true;
                  userData.data.is_account_locked = true;

                  // res.redirect(`${process.env.FRONTEND_URL}/`);
                }
                await userData.data.save();
                return res.status(401).json({
                  message:
                    userData.data.attempt === 3
                      ? `please contacts with admin to change your password!`
                      : `You have ${3 - userData.data.attempt} attempt left`,
                  status: false,
                });
              }
            }
          } catch (err) {
            console.log("err2 --> ", err);
            return res.status(500).json({ message: err, status: false });
          }
        } else {
          return res.status(403).json({
            status: false,
            message: "please contact with your reseller / reseller Admin!",
          });
        }
      } else {
        return res.status(401).json({
          message: "Please verify the gmail before login!",
          status: false,
        });
      }
    } else {
      return res
        .status(401)
        .json({ message: "Invalid Credentials", status: false });
    }
  } catch (err) {
    console.log("err3 --> ", err);
    return res.status(500).json({ message: err, status: false });
  }
});

// Function to get estimated location from IP address
function getEstimatedLocation(ip) {
  const geo = geoip.lookup(ip);
  // console.log(geo)
  if (geo) {
    return `${geo.city}, ${geo.region}, ${geo.country}`;
  } else {
    return "Unknown";
  }
}

/* Forgot Password Api */
router.post("/forgotpassword", async function (req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ status: false, error: "Please Provide Mail id" });
    }
    const userData = await User.findOne({ email: req.body.email });
    if (!userData)
      return res.status(404).json({ status: false, error: "no records found" });
    if (userData.isAccess) {
      return res.status(400).json({
        error: "Access Blocked. please connect with our admin.",
        status: false,
      });
    }
    // Code to generate and send password reset token
    let generateToken = createJwt(req.body.email, userData._id.toString());
    const tokenData = new Token({
      userId: userData._id.toString(),
      token: generateToken,
    });
    await tokenData.save();
    var resetLink =
      `${process.env.FRONTEND_URL}/axonaio/user/reset-password?token=` +
      generateToken;
    var status = await sendEmail(
      userData.email,
      "Password Reset Request",
      { name: userData.name, link: resetLink },
      "./template/requestReset.handlebars"
    );
    if (status) {
      return res
        .status(200)
        .json({ message: "Password reset mail sent", status: true });
    } else {
      return res
        .status(401)
        .json({ message: "Something went wrong!", status: false });
    }
  } catch (error) {
    return res.status(500).json({ status: false, error: error.message });
  }
});

// RESET PASSWORD
router.post("/resetPasswordLink", async (req, res) => {
  [
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { email } = req.body;
      if (!email) {
        return res
          .status(400)
          .json({ status: false, error: "Please Provide Mail id" });
      }

      try {
        let user = await User.findOne({ email });

        if (!user) {
          return res.status(400).json({ msg: "Invalid Credentials" });
        }
        const payload = {
          user: {
            id: user.id,
          },
        };

        jwt.sign(
          payload,
          config.get("jwtSecret"),
          {
            expiresIn: "12h",
          },
          (err, token) => {
            if (err) throw err;
            res.status(200).json({ token });
          }
        );
      } catch (error) {
        // console.error(err.message);
        return res.status(500).json({ status: false, error: error.message });
      }
    };
});

// router.get("/sendotp" , sendOTP)

router.get("/checkToken", tokenVerify, checkTokenForEmailExist);

// update-password
router.patch("/update-password", tokenVerify, updatePassword);

// fetch api for email verification
router.patch("/email-verify", tokenVerify, emailVerify);
router.get("/profile", verifyToken, getProfileDetails);

// logout
router.post("/logout", verifyToken, logoutFromSite);

// update profile
router.patch("/update-profile", verifyToken, updateProfile);

// ONBOARDING DETAILS

router.post(
  "/onboarding",
  verifyResellerToken,
  upload.fields([
    { name: "panAttachment", maxCount: 1 },
    { name: "cancelledChequeAttachment", maxCount: 1 },
    { name: "aadharVoterIdPassportAttachment", maxCount: 1 },
  ]),

  async function (req, res) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      if (!token) {
        return res.status(403).json({ status: false, error: "unauthorized" });
      }
      const {
        name,
        password,
        email,
        phonenumber,
        confirmpassword,
        companyName,
        businessType,
        businessCategory,
        description,
        website,
        city,
        state,
        address,
        pincode,
        agree,
        panNumber,
        aadharVoterIdPassportDLNumber,
        gstNumber,
        cancelledCheque,
        companyPan,
        registrationCertificate,
      } = req.body;

      if (
        !name ||
        !password ||
        !email ||
        !phonenumber ||
        !confirmpassword ||
        !companyName ||
        !businessType ||
        !businessCategory ||
        !description ||
        !website ||
        !city ||
        !state ||
        !address ||
        !pincode ||
        !agree ||
        !panNumber ||
        !aadharVoterIdPassportDLNumber ||
        !gstNumber ||
        !cancelledCheque ||
        !companyPan ||
        !registrationCertificate
      ) {
        return res
          .status(400)
          .json({ status: false, error: "all fields are mandatory" });
      }

      const {
        panAttachment,
        cancelledChequeAttachment,
        aadharVoterIdPassportAttachment,
      } = req.files;

      if (
        !panAttachment[0] ||
        !cancelledChequeAttachment[0] ||
        !aadharVoterIdPassportAttachment[0]
      ) {
        return res
          .status(400)
          .json({ status: false, error: "All Documents mandatory" });
      }

      const emailExist = await userModel.findOne({ email });
      if (emailExist) {
        return res
          .status(409)
          .json({ status: false, error: "email already exists" });
      }

      const phoneNumberExist = await userModel.findOne({ phonenumber });
      if (phoneNumberExist) {
        return res
          .status(409)
          .json({ status: false, error: "phonenumber already exists" });
      }

      // Encrypt the password using AES encryption

      const ciphertext = CryptoJS.AES.encrypt(
        password,
        process.env.REFRESH_TOKEN_SECRET
      ).toString();

      // Create user with encrypted password
      const userData = await userModel.create({
        name,
        phonenumber,
        password: ciphertext,
        email: String(email).toLowerCase(),
        prevPassword: ciphertext, // Is this intended? It seems redundant
        is_merchant: true,
        m_id: generateMerchantId(),
        is_active: true,
      });

      const merchantId = userData.m_id;

      const UserDocData = {
        m_id: merchantId,
        companyName: companyName,
        businessType: businessType,
        businessCategory: businessCategory,
        description: description,
        website: website,
        city: city,
        state: state,
        address: address,
        pincode: pincode,
        accountHolderName: req.body.accountHolderName,
        accountType: req.body.accountType,
        accountNumber: req.body.accountNumber,
        confirmAn: req.body.confirmAn,
        ifscCode: req.body.ifscCode,
        branchName: req.body.branchName,
        panNumber,
        aadharVoterIdPassportDLNumber,
        gstNumber,
        cancelledCheque,
        companyPan,
        registrationCertificate,
        cancelledChequeAttachment: cancelledChequeAttachment[0]?.filename,
        aadharVoterIdPassportAttachment:
          aadharVoterIdPassportAttachment[0]?.filename,
        panAttachment: panAttachment[0]?.filename,
      };
      const userDocDetails = await userDocModel.updateOne(
        { m_id: merchantId },
        UserDocData,
        { upsert: true }
      );
      let updatedUserData;
      console.log(userDocDetails);
      if (userDocDetails.acknowledged) {
        updatedUserData = await userModel.updateOne(
          { m_id: merchantId },
          { isBasic: true, documents_upload: true }
        );
      }

      console.log("user submitted successfully ");

      try {
        //this line is creating problem
        const payload = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
        const { role, _id } = payload;
        // console.log("what is my role", role);

        if (role == "reseller") {
          const reseller = await userModel.findOne({ r_id: _id });
          if (!reseller) {
            return res
              .status(404)
              .json({ status: false, error: "no records found" });
          }

          await reseller.resellers_merchant.push(userData._id);

          await reseller.save();

          // Generate JWT token
          const generateToken = await createJwt(email, userData._id);

          // Save token to database
          const tokenData = new Token({
            userId: userData._id,
            token: generateToken,
          });
          await tokenData.save();

          // Construct email verification link
          const welcomeLink = `${process.env.FRONTEND_URL}/axonaio/user/email-verification?token=${generateToken}`;

          // Send verification email
          await sendEmail(
            email,
            "Verify your email",
            { name: userData.name, link: welcomeLink },
            "./template/welcome.handlebars"
          );

          // prepareData
          const user = await userModel
            .findOne({
              m_id: merchantId,
            })
            .select("-password -prevPassword -prevPrevPassword");
          console.log(user);

          return res.status(201).json({
            message: "merchant Created through reseller successfully",
            data: user,
            status: true,
          });

          // Attach reseller to request object if needed

          // if the role is reseller admin
        } else if (role == "reseller_admin") {
          const resellerAdmin = await User.findOne({ ra_id: _id });
          if (!resellerAdmin) {
            return res
              .status(404)
              .json({ status: false, error: "no records found" });
          }

          await resellerAdmin.reseller_admins_merchant.push(userData._id);

          await resellerAdmin.save();
          // Generate JWT token
          const generateToken = await createJwt(email, userData._id);

          // Save token to database
          const tokenData = new Token({
            userId: userData._id,
            token: generateToken,
          });
          await tokenData.save();

          // Construct email verification link
          const welcomeLink = `${process.env.FRONTEND_URL}/axonaio/user/email-verification?token=${generateToken}`;

          // Send verification email
          await sendEmail(
            email,
            "Verify your email",
            { name: userData.name, link: welcomeLink },
            "./template/welcome.handlebars"
          );

          // Send success response
          return res.status(201).json({
            message: "merchant Created through reseller-admin successfully",
            data: { updatedUserData, userDocDetails },
            status: true,
          });
        } else {
          return res.status(403).json({ message: "Forbidden" });
        }
      } catch (error) {
        return res.status(401).json({ status: false, error: error.message });
      }
    } catch (error) {
      return res.status(500).json({ status: false, error: error.message });
    }
  }
);

router.get("/validate", async (req, res, next) => {
  const token = req.headers?.authorization?.split(" ")[1];
  // console.log(req.headers?.authorization?.split(" ")[1]);
  if (token) {
    const isVerified = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
    if (!isVerified) {
      res.status.json({ error: "session expired please login again" });
    }
    res.json({
      isValid: true,
    });
  } else {
    res.status(200).json({ isValid: false });
  }
});
module.exports = router;
