const PayinTransactionModel = require("../../models/Payin/PayinTransaction");
const ResellePayin = require("../../models/resellerModels/ResellerPayIn");
const moment = require("moment-timezone");

const Get_Resellers_merchant_Payin = async (req, res) => {
  const { page, perPage, search, startDate, endDate } = req?.query;

  res.json({
    message: "Reseller Payin fetched successfully",
  });
};

// ---------------------- MERCHANT SUCCESS VOLUME ---------------------

const Get_Resellers_Merchant_Success_Volume = async (req, res) => {
  const { startDate, endDate, merchant_id } = req.body;
  const isoStartDate = startDate;
  const isoEndDate = endDate;

  const payinTransactionSuccess = await PayinTransactionModel.aggregate([
    {
      $match: {
        merchant_id: mongoose.Types.ObjectId(merchantId),
        transaction_date: { $gte: startDate, $lte: endDate },
        transaction_status: "success",
      },
    },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$transaction_amount" },
      },
    },
  ]);

  res.json({
    payinTransactionSuccess,
    message: "Reseller Payin Success amount Fetched successfully",
  });
};
// -----------------------------------------------------------------------

const Get_Reseller_AllCount = async (req, res) => {
  const { startDate, endDate } = req.body;

  const pipeline = [];

  const TransactionCount = await ResellePayin.aggregate(pipeline);
  const SuccessCount = await ResellePayin.aggregate(pipeline);
  const FailedCount = await ResellePayin.aggregate(pipeline);

  res.json({
    Counts: { TransactionCount, SuccessCount, FailedCount },
    message: "Reseller Count fetched successfully",
  });
};
const Fetch_Resellers_Merchant = async (req, res) => {
  let TOKEN = localStorage.getItem("is_logged_in");
  const data = jwt.verify(TOKEN, process.env.JWT_TOKEN_SECRET);
  console.log(data);
  const pipeline = [];

  const TransactionCount = await ResellePayin.findById();
  const SuccessCount = await ResellePayin.aggregate(pipeline);
  const FailedCount = await ResellePayin.aggregate(pipeline);

  res.json({
    Counts: { TransactionCount, SuccessCount, FailedCount },
    message: "Reseller Count fetched successfully",
  });
};

const Get_Total_Tax = async (req, res) => {
  const { page, perPage, search, startDate, endDate } = req?.query;
  console.log(startDate, endDate, "dates..");
  const isoStartDate = moment(
    startDate,
    "ddd MMM DD YYYY HH:mm:ss ZZ",
    "en",
    true
  )
    .tz("Asia/Kolkata")
    .toDate();
  new Date(startDate);
  const isoEndDate = moment(endDate, "ddd MMM DD YYYY HH:mm:ss ZZ", "en", true)
    .tz("Asia/Kolkata")
    .toDate();
  console.log(isoEndDate, isoStartDate, "iso dates..");
  const currPage = +page;
  const limit = +perPage;
  const skip = (currPage - 1) * limit;

  const pipeline = [
    // { $match: { transaction_date: { $gte: isoStartDate, $lte: isoEndDate } } }, // Filter early
    { $sort: { transaction_date: 1 } }, // Sort if needed
    { $skip: skip },
    { $limit: limit },
    {
      $project: {
        _id: 0, // Select specific fields if needed
        transaction_date: 1,
        // ... other fields
      },
    },
    {
      $group: { _id: null, documents: { $push: "$$ROOT" }, count: { $sum: 1 } },
    },
  ];

  const resellerPayinData = await ResellePayin.aggregate(pipeline);
  const filterResellerData = await ResellePayin.find({
    transaction_date: { $gte: isoStartDate, $lte: isoEndDate },
  });
  console.log(filterResellerData, "reseller controller");
  res.json({
    resellerPayinData,
    message: "Reseller Payin fetched successfully",
  });
};
const Get_Total_Fees = async (req, res) => {
  const { page, perPage, search, startDate, endDate } = req?.query;
  console.log(startDate, endDate, "dates..");
  const isoStartDate = moment(
    startDate,
    "ddd MMM DD YYYY HH:mm:ss ZZ",
    "en",
    true
  )
    .tz("Asia/Kolkata")
    .toDate();
  new Date(startDate);
  const isoEndDate = moment(endDate, "ddd MMM DD YYYY HH:mm:ss ZZ", "en", true)
    .tz("Asia/Kolkata")
    .toDate();
  console.log(isoEndDate, isoStartDate, "iso dates..");
  const currPage = +page;
  const limit = +perPage;
  const skip = (currPage - 1) * limit;

  const pipeline = [
    // { $match: { transaction_date: { $gte: isoStartDate, $lte: isoEndDate } } }, // Filter early
    { $sort: { transaction_date: 1 } }, // Sort if needed
    { $skip: skip },
    { $limit: limit },
    {
      $project: {
        _id: 0, // Select specific fields if needed
        transaction_date: 1,
        // ... other fields
      },
    },
    {
      $group: { _id: null, documents: { $push: "$$ROOT" }, count: { $sum: 1 } },
    },
  ];

  const resellerPayinData = await ResellePayin.aggregate(pipeline);
  const filterResellerData = await ResellePayin.find({
    transaction_date: { $gte: isoStartDate, $lte: isoEndDate },
  });
  console.log(filterResellerData, "reseller controller");
  res.json({
    resellerPayinData,
    message: "Reseller Payin fetched successfully",
  });
};

module.exports = {
  Get_Resellers_merchant_Payin,
};
