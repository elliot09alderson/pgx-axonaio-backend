const BankDetails = require("../models/bankdetails")

const fetchBankingDetails = async (req, res) => {

  try {
    
    const merchantId = req.user.m_id
    const banking = await BankDetails.findOne({ m_id: merchantId });
    if (banking) {
      res.status(200).json({status: true, message: "fetched successfully",data:banking})
    } else {
      res.status(404).json({ status:false, Error: 'no records found!' })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'server is poor!' })
  }
}

const createBankingDetails = async function (req, res) {
  try {
    const merchantId = req.user.m_id

    const bankDatatwo = {
      accountHolderName: req.body.accountHolderName,
      accountType: req.body.accountType,
      accountNumber: req.body.accountNumber,
      confirmAn: req.body.confirmAn,
      ifscCode: req.body.ifscCode,
      branchName: req.body.branchName,
      m_id: merchantId 
    };
    const bankDetails = await BankDetails.updateOne({ m_id: merchantId  }, bankDatatwo, { upsert: true })
    if (bankDetails) {
      return res.status(200).json({
        message: "Bank details created or updated successfully!",
        status: true,
      })
    } else {
      res.status(400).json({ status:false,Error: 'Details is still not updated!' })
    }
  } catch (err) {
    return res.status(500).send({ Error: err.message, status: false });
  }
}
module.exports = {
  fetchBankingDetails,
  createBankingDetails
}