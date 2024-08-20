const DocumentDetails = require("../models/documentsDetails");
const User = require("../models/user");

const documentFileCreate = (req, res) => {
  try {
    res.status(201).json(req.file);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error!" });
  }
};

const documentCreate = async function (req, res) {
  try {
    // Extracting data from the request body
    const merchantId = req.user.m_id
    const formValues = req.body.formValues || {};
    const attachment = req.body.attachment || {};

    // Creating documents data object with default values
    const documentsData = {
      panNumber: formValues.panNumber || "",
      aadharVoterIdPassportDLNumber:
        formValues.aadharVoterIdPassportDLNumber || "",
      gstNumber: formValues.gstNumber || "",
      cancelledCheque: formValues.cancelledCheque || "",
      companyPan: formValues.companyPan || "",
      registrationCertificate: formValues.registrationCertificate || "",
      cancelledChequeAttachment: attachment.cancelledChequeAttachment || "",
      aadharVoterIdPassportAttachment:
        attachment.aadharVoterIdPassportAttachment || "",
      panAttachment: attachment.panAttachment || "",
      m_id: merchantId,
    };

    // Updating documents details
    const documentsDetails = await DocumentDetails.updateOne(
      { m_id: merchantId },
      documentsData,
      { upsert: true }
    );

    if (documentsDetails) {
      // Updating user details
      await User.updateOne(
        { m_id: merchantId },
        { isBasic: true, documents_upload: true }
      );

      // Retrieving updated user document
      const doc = await User.findOne({m_id:merchantId});

      return res.status(200).send({
        message: "Documents details created or updated successfully!",
        result: true,
        isBasic: doc.isBasic,
        app_mode: doc.app_mode,
        bg_verified: doc.bg_verified,
        m_id: doc.m_id,
        is_reseller: doc.is_reseller,
      });
    } else {
      // If documentsDetails is falsy, return error response
      res.status(401).json({ message: "Details are still not updated!" });
    }
  } catch (err) {
    // Handling errors
    return res.status(500).send({ message: err.message, result: false });
  }
};

const documentFetch = async (req, res) => {
  try {
    const document = await DocumentDetails.findOne({ userId: req.user._id });
    if (document) {
      res.status(200).json(document);
    } else {
      res.status(401).json({ message: "document is not found!" });
    }
  } catch (error) {
    console.log(error);
    res.status(200).json("server is poor!");
  }
};

module.exports = {
  documentFileCreate,
  documentCreate,
  documentFetch,
};
