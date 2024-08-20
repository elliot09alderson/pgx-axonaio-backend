const userModel = require("../models/user");
const PayinTransactionModel = require("../models/Payin/PayinTransaction");
const PayoutTransactionModel = require("../models/payout/transfer");
const PayoutFundStatementModel = require("../models/payout/fundStatement");
const userDocModel = require("../models/userDocDetails/userDocDetails");
var CryptoJS = require("crypto-js");
const Token = require("../models/tokenSchema");
const { createJwt } = require("../utils/jwt_token");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/email/sendEmail");

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
function generateResellerId() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const minLength = 18;
  const maxLength = 24;
  const length =
    Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
  let merchantId = "R_";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    merchantId += characters.charAt(randomIndex);
  }

  return merchantId;
}

//    INDIVIDUAL RESELLER ADMIN'S MERCHANT OPERATION

exports.createMerchant = async (req, res) => {
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
        const generateToken = await createJwt(email, userData._id, "merchant");

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
        const resellerAdmin = await userModel.findOne({ ra_id: _id });
        if (!resellerAdmin) {
          return res
            .status(404)
            .json({ status: false, error: "no records found" });
        }

        await resellerAdmin.reseller_admins_merchant.push(userData._id);

        await resellerAdmin.save();
        // Generate JWT token
        const generateToken = await createJwt(email, userData._id, "merchant");

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
};

exports.createReseller = async (req, res) => {
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
      is_reseller: true,
      r_id: generateResellerId(),
      is_active: true,
    });

    const resellerId = userData.r_id;

    const UserDocData = {
      r_id: resellerId,
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
      { r_id: resellerId },
      UserDocData,
      { upsert: true }
    );
    let updatedUserData;

    if (userDocDetails.acknowledged) {
      updatedUserData = await userModel.updateOne(
        { r_id: resellerId },
        { isBasic: true, documents_upload: true }
      );
    }

    console.log("user submitted successfully ");

    try {
      //this line is creating problem
      const payload = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
      const { role, _id } = payload;
      // console.log("what is my role", role);

      if (role == "reseller_admin") {
        const resellerAdmin = await userModel.findOne({ ra_id: _id });
        if (!resellerAdmin) {
          return res
            .status(404)
            .json({ status: false, error: "no records found" });
        }

        await resellerAdmin.my_resellers.push(userData._id);

        await resellerAdmin.save();
        // Generate JWT token
        const generateToken = await createJwt(
          email,
          userData._id,
          "reseller_admin"
        );

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
};
//   get All merchants using resellerAdminId

exports.getAllMerchantsByRAId = async (req, res) => {
  try {
    const resellerAdminId = req.user.ra_id;

    const merchants = await userModel
      .findOne({
        ra_id: resellerAdminId,
      })
      .populate("reseller_admins_merchant");

    return res.status(200).json({
      status: true,
      message: "fetched successfully",
      data: merchants ? merchants.reseller_admins_merchant : [],
    });
  } catch (error) {
    return res.status(500).json({ status: false, error: error.message });
  }
};

// get PayinTransaction of merchants by selecting date
exports.getPayinTransactionByDate = async (req, res) => {
  try {
    const merchantId = req.params.id;
    const resellerAdminId = req.user.ra_id;

    const findMerchantsbyRid = await userModel.findOne({
      m_id: merchantId,
    });

    if (!findMerchantsbyRid) {
      return res
        .status(403)
        .json({ status: false, error: "something went wrong" });
    }

    // Extracting date filter parameters from the request query
    const { startDate, endDate } = req.query;

    // Validating the presence of startDate and endDate
    if (!startDate || !endDate) {
      return res.status(400).json({
        status: false,
        error: "Both startDate and endDate are required",
      });
    }
    if (findMerchantsbyRid.ra_id === resellerAdminId) {
      // Parsing the date strings to Date objects and converting them to UTC
      const start = new Date(startDate + "T00:00:00.000Z");
      const end = new Date(endDate + "T23:59:59.999Z");

      // Querying Transaction with timestamps within the specified range
      const Transactions = await PayinTransactionModel.find({
        m_id: merchantId,
        createdAt: { $gte: start, $lte: end },
      });

      if (Transactions.length === 0) {
        return res
          .status(404)
          .json({ status: false, error: "no records found" });
      }

      // Sending the Transactions as the API response
      res.status(200).json({
        status: true,
        message: "fetched successfully",
        data: Transactions,
      });
    } else {
      return res.status(403).json({ status: false, error: "unauthorized" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" });
  }
};

/* -------------------------------------------------------------------------- */
/*                         deactivate / activate                             */
/* -------------------------------------------------------------------------- */

exports.toggleActivateMerchant = async (req, res) => {
  try {
    const merchantId = req.params.id;
    const resellerAdmin = req.user;

    if (resellerAdmin) {
      const merchantObjId = await userModel.findOne({ m_id: merchantId });
      const merchant_str = merchantObjId._id.toString();
      const merchantExists = resellerAdmin.reseller_admins_merchant.some(
        (id) => id.toString() === merchant_str
      );

      if (merchantExists) {
        const merchant = await userModel.findOne({ m_id: merchantId });

        if (!merchant.is_active) {
          const updateResult = await userModel.updateOne(
            { m_id: merchantId },
            { $set: { is_active: true } }
          );
          return res
            .status(200)
            .json({ status: true, message: "merchant activated successfully" });
        } else {
          updateResult = await userModel.updateOne(
            { m_id: merchantId },
            { $set: { is_active: false } }
          );

          return res.status(200).json({
            status: true,
            message: "merchant deactivated successfully",
          });
        }
      } else {
        return res.status(404).json({
          status: false,
          error: "Reseller Admin does not created this merchant ",
        });
      }
    } else {
      return res.status(404).json({
        status: false,
        error: "Merchant ID not found in reseller Admin's merchant array.",
      });
    }
    /* -------------------------------------------------------------------------- */
    /*                                    End                                    */
    /* -------------------------------------------------------------------------- */
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server error in reseller Admin controller" });
  }
};

exports.toggleActivateReseller = async (req, res) => {
  try {
    const resellerId = req.params.id;
    const resellerAdmin = req.user;

    if (resellerAdmin) {
      const merchantObjId = await userModel.findOne({ r_id: resellerId });
      const merchant_str = merchantObjId._id.toString();
      const merchantExists = resellerAdmin.my_resellers.some(
        (id) => id.toString() === merchant_str
      );

      if (merchantExists) {
        const merchant = await userModel.findOne({ r_id: resellerId });

        if (!merchant.is_active) {
          const updateResult = await userModel.updateOne(
            { r_id: resellerId },
            { $set: { is_active: true } }
          );
          return res
            .status(200)
            .json({ status: true, message: "merchant activated successfully" });
        } else {
          updateResult = await userModel.updateOne(
            { r_id: resellerId },
            { $set: { is_active: false } }
          );

          return res.status(200).json({
            status: true,
            message: "reseller deactivated successfully",
          });
        }
      } else {
        return res.status(404).json({
          status: false,
          error: "Reseller Admin does not created this reseller ",
        });
      }
    } else {
      return res.status(404).json({
        status: false,
        error: "reseller ID not found in reseller Admin's reseller array.",
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server error in reseller Admin controller" });
  }
};
/* -------------------------------------------------------------------------- */
/*                                    End                                    */
/* -------------------------------------------------------------------------- */

// **********************************RESELLER-OPERATION***********************************

exports.getAllResellersByRAId = async (req, res) => {
  try {
    const resellerAdminId = req.user.ra_id;

    const resellers = await userModel
      .findOne({
        ra_id: resellerAdminId,
        is_reseller_admin: true,
      })
      .select("-password -prevPassword -prevPrevPassword")
      .populate({
        path: "my_resellers",
        select: "-password -prevPassword -prevPrevPassword", // Populate select
      });

    console.log("resellers =>", resellers.my_resellers);
    return res.status(200).json({
      status: true,
      message: "fetched successfully",
      data: resellers ? resellers.my_resellers : [],
    });
  } catch (error) {
    return res.status(500).json({ status: false, error: error.message });
  }
};

exports.getAllMerchantsOfReseller = async (req, res) => {
  try {
    const resellerAdminId = req.user.ra_id;
    const resellerId = req.params.rid;
    console.log("===>> rid", req.params.rid);
    const resellerMerchants = await userModel
      .findOne({
        // ra_id: resellerAdminId,
        r_id: resellerId,
      })
      .populate("resellers_merchant");

    console.log(resellerMerchants.resellers_merchant);

    return res.status(200).json({
      status: true,
      message: "fetched successfully",
      data: resellerMerchants.resellers_merchant,
    });
  } catch (error) {
    return res.status(500).json({ status: false, error: error.message });
  }
};

exports.getTodaysPayinTransactionThroughSelection = async (req, res) => {
  try {
    const merchantId = req.params.id;

    if (!merchantId) {
      return res
        .status(400)
        .json({ status: false, error: "Please Provide merchantId" });
    }

    if (req.user.ra_id) {
      // Find transaction data for the current user within today's date range
      const TransactionsData = await PayinTransactionModel.find({
        m_id: merchantId,
        createdAt: { $gte: today, $lte: tomorrow },
      }).sort({ createdAt: -1 });

      if (TransactionsData.length > 0) {
        res.status(200).json({ status: true, data: TransactionsData });
      } else {
        res.status(404).json({ status: false, error: "no records found" });
      }
    } else {
      return res.status(403).json({ status: false, error: "unauthorized" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* -------------------------------------------------------------------------- */
/*                         Reseller admin Transactions                        */
/* -------------------------------------------------------------------------- */

exports.getTodaysPayinTransaction = async (req, res) => {
  try {
    const merchantId = req.params.id;

    if (!merchantId) {
      return res
        .status(400)
        .json({ status: false, error: "Please Provide merchantId" });
    }

    if (req.user.ra_id) {
      const today = new Date();
      // Set the time to the beginning of the day (00:00:00)
      today.setHours(0, 0, 0, 0);

      // Get tomorrow's date
      const tomorrow = new Date(today);
      // Set the time to the end of the day (23:59:59)
      tomorrow.setDate(today.getDate() + 1);
      tomorrow.setHours(23, 59, 59, 999);
      // Find transaction data for the current user within today's date range
      const TransactionsData = await PayinTransactionModel.find({
        m_id: merchantId,
        createdAt: { $gte: today, $lte: tomorrow },
      }).sort({ createdAt: -1 });

      if (TransactionsData.length > 0) {
        res.status(200).json({ status: true, data: TransactionsData });
      } else {
        res.status(404).json({ status: false, error: "no records found" });
      }
    } else {
      return res.status(403).json({ status: false, error: "unauthorized" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getTodaysPayinTransactionByDate = async (req, res) => {
  console.log("asdasdasdasdasadsda");
  try {
    const merchantId = req.params.id;
    const { startDate, endDate } = req.query;
    console.log(startDate, endDate);

    // Validating the presence of startDate and endDate
    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ Error: "Both startDate and endDate are required" });
    }

    // // Parsing the date strings to Date objects and converting them to UTC
    // const start = new Date(startDate + "T00:00:00.000Z");
    // const end = new Date(endDate + "T23:59:59.999Z");

    console.log(startDate, endDate);
    const Transactions = await PayinTransactionModel.find({
      m_id: merchantId,
      createdAt: { $gte: startDate, $lte: endDate },
    }).sort({ createdAt: -1 });

    console.log("Transactions--->", Transactions);
    if (Transactions.length === 0) {
      return res.status(404).json({ status: false, error: "no records found" });
    }

    // Sending the Transactions as the API response
    res.status(200).json({ status: true, data: Transactions });
  } catch (error) {
    res.status(500).json({ message: "Internal lafda Error" });
  }
};

/* -------------------------------------------------------------------------- */
/*                         Reseller admin Transfers                        */
/* -------------------------------------------------------------------------- */

exports.getTodaysTransfer = async (req, res) => {
  try {
    const merchantId = req.params.id;

    if (!merchantId) {
      return res
        .status(400)
        .json({ status: false, error: "Please Provide merchantId" });
    }

    if (req.user.ra_id) {
      const today = new Date();
      // Set the time to the beginning of the day (00:00:00)
      today.setHours(0, 0, 0, 0);

      // Get tomorrow's date
      const tomorrow = new Date(today);
      // Set the time to the end of the day (23:59:59)
      tomorrow.setDate(today.getDate() + 1);
      tomorrow.setHours(23, 59, 59, 999);
      // Find transaction data for the current user within today's date range
      const TransferData = await PayoutTransactionModel.find({
        m_id: merchantId,
        createdAt: { $gte: today, $lte: tomorrow },
      }).sort({ createdAt: -1 });

      if (TransferData.length > 0) {
        res.status(200).json({ status: true, data: TransferData });
      } else {
        res.status(404).json({ status: false, error: "no records found" });
      }
    } else {
      return res.status(403).json({ status: false, error: "unauthorized" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getTodaysTransferByDate = async (req, res) => {
  console.log("asdasdasdasdasadsda");
  try {
    const merchantId = req.params.id;
    const { startDate, endDate } = req.query;
    console.log(startDate, endDate);

    // Validating the presence of startDate and endDate
    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ Error: "Both startDate and endDate are required" });
    }

    // // Parsing the date strings to Date objects and converting them to UTC
    // const start = new Date(startDate + "T00:00:00.000Z");
    // const end = new Date(endDate + "T23:59:59.999Z");

    console.log(startDate, endDate);
    const Transfer = await PayoutTransactionModel.find({
      m_id: merchantId,
      createdAt: { $gte: startDate, $lte: endDate },
    }).sort({ createdAt: -1 });

    console.log("Transfer--->", Transfer);
    if (Transfer.length === 0) {
      return res.status(404).json({ status: false, error: "no records found" });
    }

    // Sending the Transfer as the API response
    res.status(200).json({ status: true, data: Transfer });
  } catch (error) {
    res.status(500).json({ message: "Internal lafda Error" });
  }
};
/* -------------------------------------------------------------------------- */
/*                         Reseller admin fundstatements                        */
/* -------------------------------------------------------------------------- */

exports.getTodaysFundStatement = async (req, res) => {
  try {
    const merchantId = req.params.id;

    if (!merchantId) {
      return res
        .status(400)
        .json({ status: false, error: "Please Provide merchantId" });
    }

    if (req.user.ra_id) {
      const today = new Date();
      // Set the time to the beginning of the day (00:00:00)
      today.setHours(0, 0, 0, 0);

      // Get tomorrow's date
      const tomorrow = new Date(today);
      // Set the time to the end of the day (23:59:59)
      tomorrow.setDate(today.getDate() + 1);
      tomorrow.setHours(23, 59, 59, 999);
      // Find transaction data for the current user within today's date range
      const TransferData = await PayoutFundStatementModel.find({
        m_id: merchantId,
        createdAt: { $gte: today, $lte: tomorrow },
      }).sort({ createdAt: -1 });

      if (TransferData.length > 0) {
        res.status(200).json({ status: true, data: TransferData });
      } else {
        res.status(404).json({ status: false, error: "no records found" });
      }
    } else {
      return res.status(403).json({ status: false, error: "unauthorized" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getFundStatementByDate = async (req, res) => {
  console.log("asdasdasdasdasadsda");
  try {
    const merchantId = req.params.id;
    const { startDate, endDate } = req.query;
    console.log(startDate, endDate);

    // Validating the presence of startDate and endDate
    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ Error: "Both startDate and endDate are required" });
    }

    // // Parsing the date strings to Date objects and converting them to UTC
    // const start = new Date(startDate + "T00:00:00.000Z");
    // const end = new Date(endDate + "T23:59:59.999Z");

    console.log(startDate, endDate);
    const Transfer = await PayoutFundStatementModel.find({
      m_id: merchantId,
      createdAt: { $gte: startDate, $lte: endDate },
    }).sort({ createdAt: -1 });

    console.log("Transfer--->", Transfer);
    if (Transfer.length === 0) {
      return res.status(404).json({ status: false, error: "no records found" });
    }

    // Sending the Transfer as the API response
    res.status(200).json({ status: true, data: Transfer });
  } catch (error) {
    res.status(500).json({ message: "Internal lafda Error" });
  }
};
