const dns = require("dns");
const { LogTable } = require("../models/logTable");
const { WhiteLabel } = require("../models/whiteLabelSchema");
const axios = require("axios");

const createWhiteLabel = async (req, res) => {
  try {
    const {
      merchantId,
      domain,
      companyName,
      contactNumber,
      emailId,
      companyAddress,
    } = req.body;

    const data = new WhiteLabel({
      merchantId,
      domain,
      ipAddress: req.body.ipAddress ?? "",
      merchantLogo: req.file?.filename,
      companyName,
      contactNumber,
      emailId,
      companyAddress,
      merchantTemplateId: req.body.merchantTemplateId,
    });
    const result = await data.save();
    const imageUrl = "/images/" + req.file.filename;
    res.status(201).json({
      result: result,
      imageUrl: imageUrl,
    });
  } catch (error) {
    console.log(error);
  }
};

const domainGetFromDatabase = async (req, res) => {
  try {
    const { domain } = req.body;
    const data = await WhiteLabel.findOne({ domain });
    if (data) {
      return { data, status: true };
    } else {
      console.log("domain does not exist!");
      return { message: "domain does not exist!", status: false };
    }
  } catch (error) {
    return error;
  }
};

// logTable store the data automaticallly
const CreatelogTable = async (req, res) => {
  try {
    const { domain, browserName } = req.body;
    const ipAddress =
      domain === "localhost"
        ? req.socket.remoteAddress
        : req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const deviceName = req.headers["user-agent"];
    const data = new LogTable({
      domain,
      browserName,
      deviceName,
      ipAddress,
    });

    await data.save();
    result = await domainGetFromDatabase(req, res);

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  domainGetFromDatabase,
  CreatelogTable,
  createWhiteLabel,
};
