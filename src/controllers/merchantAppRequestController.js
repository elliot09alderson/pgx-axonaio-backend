const MerchantAppsRequest = require("../models/MerchantAppsRequest");

const createAppAccessRequest = async (req, res) => {
  try {
    const { app_id, useCase } = req.body;
    const data = new MerchantAppsRequest({
      merchant_id: req.user._id,
      app_id,
      useCase,
    });
    const merchantRequestData = await data.save();
    res.status(201).json(merchantRequestData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server is poor!" });
  }
};

const fetchAppAccess = async (req, res) => {
  try {
    const { app_id } = req.query;
    const data = await MerchantAppsRequest.findOne({
      app_id,
      merchant_id: req.user._id,
    });
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ message: "data is not found", status: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server is poor!" });
  }
};
module.exports = {
  createAppAccessRequest,
  fetchAppAccess,
};
