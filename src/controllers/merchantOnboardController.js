const documentModel = require("../models/userDocDetails/userDocDetails");
const userModel = require("../models/user");

// old code format for uploading files
exports.documentFileCreate = (req, res) => {
  try {
    res.status(201).json(req.file);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: error.message });
  }
};

exports.merchantOnboardBySelf = async (req, res) => {
  try {
    // console.log("User info:", req.user);
    console.log(req.files);
    const merchantId = req.user.m_id;
    if (!merchantId) {
      return res
        .status(400)
        .json({ status: false, error: "merchantId missing" });
    }
    // console.log("body", req.body);
    // console.log("files", req.files);
    let panAttachment = "";
    let cancelledChequeAttachment = "";
    let aadharVoterIdPassportAttachment = "";
    if (req.files) {
      panAttachment = req.files["panAttachment"][0];
      cancelledChequeAttachment = req.files["cancelledChequeAttachment"][0];
      aadharVoterIdPassportAttachment =
        req.files["aadharVoterIdPassportAttachment"][0];
    }

    console.log("Merchant ID:", merchantId);
    console.log("body===> ", req.body);
    const UserDocData = {
      m_id: merchantId,
      companyName: req.body.companyName,
      businessType: req.body.businessType,
      businessCategory: req.body.businessCategory,
      description: req.body.description,
      website: req.body.website,
      city: req.body.city,
      state: req.body.state,
      address: req.body.address,
      pincode: req.body.pincode,
      accountHolderName: req.body.accountHolderName,
      accountType: req.body.accountType,
      accountNumber: req.body.accountNumber,
      confirmAn: req.body.confirmAn,
      ifscCode: req.body.ifscCode,
      branchName: req.body.branchName,
      panNumber: req.body.panNumber,
      aadharVoterIdPassportDLNumber: req.body.aadharVoterIdPassportDLNumber,
      gstNumber: req.body.gstNumber,
      cancelledCheque: req.body.cancelledCheque,
      companyPan: req.body.companyPan,
      registrationCertificate: req.body.registrationCertificate,
      cancelledChequeAttachment: cancelledChequeAttachment?.filename,
      aadharVoterIdPassportAttachment:
        aadharVoterIdPassportAttachment?.filename,
      panAttachment: panAttachment?.filename,
      // Assuming file attachments are handled elsewhere
    };
    console.log("Form values processed===>", UserDocData);

    const userCheck = await userModel.findOne({ m_id: merchantId });
    if (!userCheck) {
      return res.status(404).json({ status: false, error: "No records found" });
    }

    const userDocDetails = await documentModel.updateOne(
      { m_id: merchantId },
      UserDocData,
      { upsert: true }
    );
    console.log("Document details updated");

    let updatedUserData;

    if (userDocDetails) {
      if (
        panAttachment &&
        aadharVoterIdPassportAttachment &&
        cancelledChequeAttachment
      ) {
        updatedUserData = await userModel.updateOne(
          { m_id: merchantId },
          { isBasic: true, documents_upload: true, bg_verified: true }
        );

        console.log("is basic === > ", userDocDetails);
      }
      console.log("User details updated");
    }
    const user = await userModel
      .findOne({ m_id: merchantId })
      .select("-_id -password -phonenumber -prevPassword -email ");
    return res.status(201).json({
      message: "Merchant onboarded successfully",
      user,
      status: true,
    });
  } catch (error) {
    console.error("Error during onboarding:", error);
    return res.status(500).json({ status: false, error: error.message });
  }
};

exports.fetchUserDocDetails = async (req, res) => {
  try {
    const merchantId = req.user.m_id;
    if (!merchantId) {
      return res
        .status(400)
        .json({ status: false, error: "merchantId missing" });
    }

    const userDocDetails = await documentModel.findOne({ m_id: merchantId });
    if (userDocDetails) {
      res.status(200).json({
        status: true,
        message: "fetched successfully",
        data: userDocDetails,
      });
    } else {
      res.status(404).json({ status: false, error: "no records found!" });
    }
  } catch (error) {
    //   console.log(error)
    return res.status(500).json({ status: false, error: error.message });
  }
};
