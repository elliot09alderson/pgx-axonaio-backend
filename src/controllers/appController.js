const Apps = require("../models/AppSchema");
const MerchantAppSMode = require("../models/MerchantAppsMode");

const appCreate = async (req, res) => {
  try {
    const { name, description } = req.body;

    const data = new Apps({
      name,
      description,
      categoryId: req.body.categoryId,
      // userId: req.user._id,
      logo: req.file.filename,
    });
    const appsData = await data.save();
    res.status(201).json(appsData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server is poor!" });
  }
};

const fetchAllApps = async (req, res) => {
  try {
    const data = await Apps.find();
    let result = [];
    for (let i = 0; i < data.length; i++) {
      let obj = {};
      const res = await MerchantAppSMode.findOne({
        app_id: { $in: data[i]._id },
        merchant_id: req.user._id,
      });
      obj["data"] = data[i];
      if (res) {
        obj["isAppAccess"] = true;
      } else {
        obj["isAppAccess"] = false;
      }
      result.push(obj);
    }
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json("server is poor!");
  }
};
module.exports = {
  appCreate,
  fetchAllApps,
};
