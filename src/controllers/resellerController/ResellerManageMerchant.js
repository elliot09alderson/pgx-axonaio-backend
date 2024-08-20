const User = require("../../models/user");
const DocumentModel = require("../../models/documentsDetails");
const Businessmodel = require("../../models/businessdetails");
const BankModel = require("../../models/bankdetails");

const addResellerMerchant = async (req, res, next) => {
  const { values } = req.body;
  // console.log(values);
  const {
    merchant_id,
    name,
    email,
    phonenumber,
    password,
    companyName,
    businessType,
    businessCategory,
    description,
    website,
    city,
    state,
    address,
    pincode,
    accountHolderName,
    accountType,
    accountNumber,
    confirmAn,
    ifscCode,
    panNumber,
    branchName,
    gstNumber,
    companyPan,
    registrationCertificate,
    cancelledCheque,
    panAttachment,
    aadharVoterIdPassportDLNumber,
    aadharVoterIdPassportAttachment,
    cancelledChequeAttachment,
  } = values;

  let ciphertext = CryptoJS.AES.encrypt(
    password,
    process.env.REFRESH_TOKEN_SECRET
  ).toString();
  // console.log(ciphertext, "ciphertext");
  try {
    const userinfo = {
      name,
      email,
      phonenumber,
      password: ciphertext,
    };

    const data = await User.create(userinfo);

    const documentinfo = {
      panNumber,
      aadharVoterIdPassportDLNumber,
      gstNumber,
      cancelledCheque,
      companyPan,
      registrationCertificate,
      panAttachment,
      aadharVoterIdPassportAttachment,
      cancelledChequeAttachment,
      userId: UserData.data._id,
    };

    const Bankinfo = {
      accountHolderName,
      accountType,
      accountNumber,
      confirmAn,
      ifscCode,
      branchName,
      userId: UserData.data._id,
    };
    const Businessinfo = {
      companyName,
      businessType,
      businessCategory,
      userId: UserData.data._id,
      description,
      website,
      city,
      state,
      address,
      pincode,
    };

    await BankModel.create(Bankinfo);

    await Businessmodel.create(Businessinfo);

    await DocumentModel.create(documentinfo);

    const Reseller = await User.findById({ merchant_id });
    await Reseller.resellers_merchant.push[data._id];
    res.json({ code: 200, message: "reseller created successfully" });
  } catch (error) {
    console.log(error.message);
  }
};

const get_Resellers_Merchant = async (req, res) => {
  const resellerId = req.user.r_id;
  try {
    const reseller = await User.findByUserId(resellerId);

    const merchants = await reseller.populate("resellers_merchant");

    if (merchants.length === 0) {
      res.status(404).json({ error: "no records found" });
    }
    console.log("merchants ==>", merchants);
    res.json({
      message: "merchants fetched successfully ... ",
      data: merchants,
    });
  } catch (error) {
    console.log(error.message);
  }
};
module.exports = { addResellerMerchant, get_Resellers_Merchant };
