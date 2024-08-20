const MerchantAppSMode = require("../models/MerchantAppsMode");

const createAppMode = async (req, res) => {
  try {
    const { app_id } = req.body;
    const doc = await MerchantAppSMode.updateOne(
      { merchant_id: req.user._id },
      { $addToSet: { app_id: app_id } },
      { upsert: true }
    );
    if (doc) {
      return res.status(200).send({
        message: "details created or updated successfully!",
        result: true,
      });
    } else {
      res.status(401).json({ messaage: "Details is still not updated!" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json("server is poor!");
  }
};

const fetchAppMode = async (req, res) => {
  try {
    const { app_id } = req.query;
    const data = await MerchantAppSMode.findOne({
      app_id: { $in: app_id },
      merchant_id: req.user._id,
    });
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ message: "data is not found!", status: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json("server is poor!");
  }
};

module.exports = {
  createAppMode,
  fetchAppMode,
};
