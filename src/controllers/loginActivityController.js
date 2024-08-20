const Log = require("../models/userLoginActivity");

// WITHOUT LOCATION
// exports.createLoginActivity  = async (req, res) => {
//     try {
//       // Get IP address, device, OS, and browser information from req.deviceInfo
//       const { ip, device, os, browser } = req.deviceInfo;

//       // Access other request parameters like user_id, etc.
//       // const { user_id } = req.body;

//       // Create a new log entry with the extracted information
//       const log = new Log({
//         log_ipaddress: ip,
//         log_device: device,
//         log_os: os,
//         log_browser: browser,
//         user_id: "hdbjhbjhfbnjnjabxjh"
//       });

//       const newLog = await log.save();
//       res.status(201).json({ message: 'Log entry created successfully', data: newLog });
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   }

const express = require("express");
const uaParser = require("ua-parser-js");
const requestIp = require("request-ip");
const geoip = require("geoip-lite");

const app = express();

// Middleware to get client IP address
app.use(requestIp.mw());

exports.createLoginActivity = async (req, res) => {
  try {
    // Extract client IP address
    // console.log(req.headers)

    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    // console.log(req)
    // console.log('Client IP address:', ip); // Log the client IP address

    // Extract user agent string
    const userAgentString = req.headers["user-agent"];
    const userAgent = uaParser(userAgentString);

    // Determine client's location based on IP address
    const estimatedLocation = getEstimatedLocation(ip);

    // console.log("ip", ip);
    // console.log("useragent", userAgentString);
    // console.log("location", estimatedLocation);

    // Save log entry
    const log = new Log({
      log_ipaddress: ip,
      log_device: estimatedLocation,
      log_os: userAgent.os.name,
      log_browser: userAgent.browser.name,
      user_id: "hdbjhbjhfbnjnjabxjh",
    });

    const newLog = await log.save();

    res
      .status(201)
      .json({ message: "Log entry created successfully", data: newLog });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Function to get estimated location from IP address
function getEstimatedLocation(ip) {
  const geo = geoip.lookup(ip);
  console.log(geo);
  if (geo) {
    return `${geo.city}, ${geo.region}, ${geo.country}`;
  } else {
    return "Unknown";
  }
}
