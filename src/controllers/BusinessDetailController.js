const BusinessDetails = require("../models/businessdetails");

const fetchBusinessDetails = async (req, res) => {
  try {
    const merchantId = req.user.m_id
    const business = await BusinessDetails.findOne({ m_id: merchantId  });
    if (business) {
      res.status(200).json({status:true, message:"fetched successfully",data:business});
    } else {
      res.status(404).json({ status: false, Error: "no records found!" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json("server is poor!");
  }
};

const createBusinessDetails = async function (req, res) {
  try {
    const merchantId = req.user.m_id
    const businessData = {
      m_id: merchantId ,
      companyName: req.body.companyName,
      businessType: req.body.businessType,
      businessCategory: req.body.businessCategory,
      description: req.body.description,
      website: req.body.website,
      city: req.body.city,
      state: req.body.state,
      address: req.body.address,
      pincode: req.body.pincode,
    };
    const businessDetail = await BusinessDetails.updateOne(
      { m_id: merchantId  },
      businessData,
      { upsert: true }
    );
    if (businessDetail) {
      return res.status(200).json({
        message: "Business details created or updated successfully!",
        status: true,
      });
    } else {
      res.status(400).json({ status:false, Error: "Details is still not updated!" });
    }
  } catch (err) {
    return res.status(500).send({ message: err.message, result: false });
  }
};

module.exports = {
  fetchBusinessDetails,
  createBusinessDetails,
};
