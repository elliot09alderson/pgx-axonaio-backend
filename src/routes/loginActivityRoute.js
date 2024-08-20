var express = require("express");
const UAParser = require("ua-parser-js");
const {
  createLoginActivity,
} = require("../controllers/loginActivityController");
var router = express.Router();

// Middleware to extract IP address, device, OS, and browser information

function extractDeviceInfo(req, res, next) {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const userAgent = req.headers["user-agent"];
  const deviceInfo = parseUserAgent(userAgent);

  req.deviceInfo = {
    ip,
    device: deviceInfo.device,
    os: deviceInfo.os,
    browser: deviceInfo.browser,
  };

  next();
}

function parseUserAgent(userAgent) {
  const parser = new UAParser();
  parser.setUA(userAgent);
  const result = parser.getResult();

  const device = result.device.model || "Unknown";
  const os = result.os.name || "Unknown";
  const browser = result.browser.name || "Unknown";

  return { device, os, browser };
}

router.get("/logs", extractDeviceInfo, createLoginActivity);
module.exports = router;
