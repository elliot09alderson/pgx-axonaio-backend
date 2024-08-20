const json2xls = require("json2xls");
const moment = require('moment-timezone');
const Reports = require("../models/ReportsSchema");
const fs = require("fs");
const {
  settlementFilterByStatusModeTypeDate,
} = require("./settlementController");
const {
  transactionFilterByStatusModeTypeDate,
} = require("./transactionController");
const offset = 5.5 * 60 * 60 * 1000; // Offset for Indian Standard Time (IST)
const createReports = async (req, res) => {
  try {
    const { from, to, mode, status, type, report_date } = req.body;
    let data;
    if (type === "transaction") {
      let temp = await transactionFilterByStatusModeTypeDate(req, res);
      data = json2xls(temp);
    } else if (type === "settlement") {
      let temp = await settlementFilterByStatusModeTypeDate(req, res);
      data = json2xls(temp);
    }
    const offset = 5.5 * 60 * 60 * 1000;
    const reportsData = new Reports({
      report_from: new Date(new Date(from).getTime() + offset),
      report_to: new Date(new Date(to).getTime() + offset),
      payment_mode: mode,
      transaction_status: status,
      report_type: type,
      merchant_employee: req.user._id,
      report_date: new Date(new Date(report_date).getTime() + offset)
    });
    await reportsData.save();
    fs.writeFileSync("data.xlsx", data, "binary");
    const filename = `data-${Date.now()}.xlsx`;
    res.download("data.xlsx", filename, function (err) {
      if (err) {
        console.log("Error:", err);
      } else {
        console.log("Excel file sent successfully");
      }
      fs.unlinkSync("data.xlsx");
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const fetchReports = async (req, res) => {
  try {
    const offset = 5.5 * 60 * 60 * 1000;
    const { from, to } = req.query;
    const reportsData = await Reports.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(new Date(from).getTime() + offset), $lte: new Date(new Date(to).getTime() + offset) },
          merchant_employee: req.user._id,
        },
      },
      {
        $project: {
          report_from: 1,
          report_to: 1,
          payment_mode: 1,
          transaction_status: 1,
          report_type: 1,
          report_date: 1,
          _id: 0,
        },
      },
      {
        $project: {
          "Report From": "$report_from",
          "Report To": "$report_to",
          "Payment Mode": "$payment_mode",
          Status: "$transaction_status",
          "Report Type": "$report_type",
          Date: "$report_date",
        },
      },
    ]);
    if (reportsData.length > 0) res.status(200).json(reportsData);
    else res.status(422).json({ message: "reports data not found!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  createReports,
  fetchReports,
};
