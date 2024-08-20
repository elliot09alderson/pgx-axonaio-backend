const Paylink = require("../models/PayLinkSchema");
const moment = require("moment-timezone");
// moment.tz.setDefault('Asia/Kolkata');
const {
  generateRandomLink,
  getRandomSevenDigitNumber,
} = require("../utils/randomUrl");

const payLinkCreate = async (req, res) => {
  try {
    const { createdAt, amount, phoneNo, linkExpire, description } = req.body;
    const offset = 5.5 * 60 * 60 * 1000; // Offset for Indian Standard Time (IST)
    const payLinkData = new Paylink({
      createdAt: new Date(new Date(createdAt).getTime() + offset),
      linkId: req.body.linkId ?? "", // 
      fxLinkID: getRandomSevenDigitNumber(),
      amount,
      name: req.body.name ?? "",
      phoneNo,
      emailID: req.body.emailID ?? "",
      shortUrl: generateRandomLink(10),
      merchant_employee: req.user._id,
      linkExpire: new Date(new Date(linkExpire).getTime() + offset),
      description,
    });
    const payLink = await payLinkData.save();
    if (payLink) {
      res.status(201).json(payLink);
    } else {
      res.status(422).json({ message: "some error occur!" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server is error!" });
  }
};

const payLinkFetch = async (req, res) => {
  try {
    const offset = 5.5 * 60 * 60 * 1000;
    const { from, to } = req.query;
    let payLinkData = await Paylink.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date(from).getTime() + offset),
            $lte: new Date(new Date(to).getTime() + offset),
          },
          merchant_employee: req.user._id,
        },
      },
      {
        $project: {
          createdAt: 1,
          linkId: 1,
          fxLinkID: 1,
          amount: 1,
          phoneNo: 1,
          emailID: 1,
          status: 1,
          total_paid: 1,
          name: 1,
          shortUrl: 1,
          linkExpire: 1,
          description: 1,
        },
      },
      // {
      //   $project: {
      //     "Created At": "$createdAt",
      //     "Link ID": "$linkId",
      //     "FX Link ID": "$fxLinkID",
      //     Amount: "$amount",
      //     "Phone No": "$phoneNo",
      //     "Email ID": "$emailID",
      //     Status: "$status",
      //     total_paid: "$total_paid",
      //     name: "$name",
      //     shortUrl: "$shortUrl",
      //     linkExpire: "$linkExpire",
      //     description: "$description",
      //   },
      // },
    ]);
    if (payLinkData.length) {
      res.status(200).json(payLinkData);
    } else {
      res.status(422).json({ message: "No payLink found", status: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server is error!" });
  }
};

const fetchPaylinkByUrl = async (req, res) => {
  try {
    const { shortUrl } = req.query;
  
    let payLinkData = await Paylink.aggregate([
      {
        $match: {
          shortUrl,
          merchant_employee: req.user._id,
        },
      },
      {
        $project: {
          fxLinkID: 1,
          amount: 1,
          phoneNo: 1,
          emailID: 1,
          status: 1,
          total_paid: 1,
          name: 1,
          shortUrl: 1,
          linkExpire: 1,
          description: 1,
        },
      },
      {
        $project: {
          name: "$name",
          phoneNumber: "$phoneNo",
          email: "$emailID",
          amount: "$amount",
          fxLinkID: "$fxLinkID",
          notes: "$description",
        },
      },
    ]);
    if (payLinkData.length) {
      res.status(200).json(payLinkData);
    } else {
      res.status(422).json({ message: "No payLink found", status: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server is error!" });
  }
};

const updatePaylinkData = async (req, res) => {
  try {
    const { name, email, fxLinkID } = req.query;
    const data = await Paylink.updateOne(
      { fxLinkID },
      { name, emailID: email },
      {
        upsert: true,
      }
    );
    if (data) {
      res.status(200).json({ message: "paylink updated successfully!" });
    } else {
      res.status(422).json({ message: "No payLink found", status: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server is error!" });
  }
};
module.exports = {
  payLinkCreate,
  payLinkFetch,
  fetchPaylinkByUrl,
  updatePaylinkData,
};
