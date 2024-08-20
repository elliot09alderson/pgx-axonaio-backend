const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DocumentsDetailsSchema = new Schema(
  {
    panNumber: { type: String },
    aadharVoterIdPassportDLNumber: { type: String },
    gstNumber: { type: String },
    cancelledCheque: { type: String },
    companyPan: { type: String },
    registrationCertificate: { type: String },
    panAttachment: { type: String },
    aadharVoterIdPassportAttachment: { type: String },
    cancelledChequeAttachment: { type: String },
    m_id : {
      type:String,
      ref:"User"
    }
  },
  { timestamps: true }
);

const DocumentDetails = mongoose.model(
  "DocumentDetails",
  DocumentsDetailsSchema
);

module.exports = DocumentDetails;
