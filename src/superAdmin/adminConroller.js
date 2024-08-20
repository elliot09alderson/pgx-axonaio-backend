const userModel = require("../models/user");
const userDocModel = require("../models/userDocDetails/userDocDetails");

var CryptoJS = require("crypto-js");

// FUNCTION FOR GENERATE MERCHANTID
function generateResellerAdminId() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const minLength = 18;
  const maxLength = 24;
  const length =
    Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
  let merchantId = "RA_";

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

//   get All merchants using resellerAdminId

exports.convertMerchantToReseller = async (req, res) => {
  try {
    const { m_id } = req.params;
    const updateData = { r_id: generateResellerId(), is_reseller: true };

    const merchant = await userModel.findOneAndUpdate(
      { $and: [{ m_id }, { is_reseller: false }] },
      { $set: updateData },
      { new: true }
    );

    if (merchant) {
      return res.status(200).json({
        status: true,
        message: "fetched successfully",
        data: merchant,
      });
    } else {
      return res.status(400).json({
        status: false,
        error: "unable to convert in to reseller",
      });
    }
  } catch (error) {
    return res.status(500).json({ status: false, error: error.message });
  }
};

exports.convertMerchantToResellerAdmin = async (req, res) => {
  try {
    const { m_id } = req.params;
    const updateData = {
      ra_id: generateResellerAdminId(),
      is_reseller_admin: true,
    };

    const merchant = await userModel.findOneAndUpdate(
      { $and: [{ m_id }, { is_reseller_admin: false }] },
      { $set: updateData },
      { new: true }
    );

    if (merchant) {
      return res.status(200).json({
        status: true,
        message: "fetched successfully",
        data: merchant,
      });
    } else {
      return res.status(400).json({
        status: false,
        error: "unable to convert in to reseller",
      });
    }
  } catch (error) {
    return res.status(500).json({ status: false, error: error.message });
  }
};

/* -------------------------------------------------------------------------- */
/*                               create Reseller                             */
/* -------------------------------------------------------------------------- */
exports.createReseller = async (req, res) => {
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
  try {
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

    if (userDocDetails.acknowledged) {
      updatedUserData = await userModel.updateOne(
        { r_id: resellerId },
        { documents_upload: true }
      );
    }

    return res.status(201).json({
      status: true,
      message: "reseller created successfully",
      data: userData,
    });
  } catch (error) {
    return res.status(500).json({ status: false, error: error.message });
  }
};

//    INDIVIDUAL RESELLER ADMIN'S MERCHANT OPERATION

exports.createResellerAdmin = async (req, res) => {
  console.log(req);
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
  console.log(
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
    registrationCertificate
  );
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
  try {
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
      is_reseller_admin: true,
      ra_id: generateResellerAdminId(),
      is_active: true,
    });

    const resellerAdminId = userData.ra_id;

    const UserDocData = {
      ra_id: resellerAdminId,
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
      { ra_id: resellerAdminId },
      UserDocData,
      { upsert: true }
    );

    if (userDocDetails.acknowledged) {
      updatedUserData = await userModel.updateOne(
        { ra_id: resellerAdminId },
        { documents_upload: true }
      );
    }

    return res.status(201).json({
      status: true,
      message: "reseller created successfully",
      data: userData,
    });
  } catch (error) {
    return res.status(500).json({ status: false, error: error.message });
  }
};
