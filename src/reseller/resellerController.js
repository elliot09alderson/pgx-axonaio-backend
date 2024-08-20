const merchantModel = require("../models/user");
const PayinTransactionModel = require("../models/Payin/PayinTransaction");
const fundModel = require("../models/payout/fundStatement");
const PayoutTransactionModel = require("../models/payout/transfer");
var CryptoJS = require("crypto-js");
const User = require("../models/user");

// FUNCTION FOR GENERATE MERCHANTID
function generateMerchantId() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const minLength = 18;
  const maxLength = 24;
  const length =
    Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
  let merchantId = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    merchantId += characters.charAt(randomIndex);
  }

  return merchantId;
}

exports.createMerchant = async (req, res) => {
  try {
    const resellerId = req.user.r_id;

    const data = req.body;

    const { name, password, email, phonenumber } = data;

    if (!name || !password || !email || !phonenumber) {
      return res
        .status(400)
        .json({ status: false, error: "all fields are mandatory" });
    }

    //  console.log( "resID",resellerId)
    const emailExist = await merchantModel.findOne({ email });
    if (emailExist) {
      return res
        .status(409)
        .json({ status: false, error: "email already exists" });
    }

    const phoneNumberExist = await merchantModel.findOne({ phonenumber });
    if (phoneNumberExist) {
      return res
        .status(409)
        .json({ status: false, error: "phonenumber already exists" });
    }

    // Encrypt the password using AES encryption

    const ciphertext = CryptoJS.AES.encrypt(
      password,
      process.env.REFRESH_TOKEN_SECRET
    ).toString();

    // Create user with encrypted password
    const merchantData = await merchantModel.create({
      name: name,
      phonenumber: phonenumber,
      password: ciphertext,
      email: String(email).toLowerCase(),
      prevPassword: ciphertext, // Is this intended? It seems redundant
      is_merchant: true,
      // r_id: resellerId,
      m_id: generateMerchantId(),
      isEmailVerify: true,
      is_active: true,
    });

    const saveMerchant = await merchantModel
      .findOne({ r_id: resellerId })
      .select("-password ,-prevPassword -prevPrevPassword");
    if (!saveMerchant) {
      return res.status(404).json({ status: false, error: "no records found" });
    }

    // console.log("saveMerchant", saveMerchant);
    saveMerchant.resellers_merchant.push(merchantData._id);
    const updatedMerchant = await saveMerchant.save();

    return res.status(200).json({
      status: true,
      message: "Created successfully",
      data: updatedMerchant,
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

/* -------------------------------------------------------------------------- */
/*                     get All merchants using resellerID                     */
/* -------------------------------------------------------------------------- */

exports.getAllMerchantsByRId = async (req, res) => {
  try {
    const resellerId = req.user.r_id;

    const merchants = await merchantModel
      .findOne({
        r_id: resellerId,
        is_reseller: true,
      })
      .select("-password -prevPassword -prevPrevPassword")
      .populate({
        path: "resellers_merchant",
        select: "-password -prevPassword -prevPrevPassword", // Populate select
      });
    return res.status(200).json({
      status: true,
      message: "fetched successfully",
      data: merchants ? merchants.resellers_merchant : [],
    });
  } catch (error) {
    return res.status(500).json({ status: false, error: error.message });
  }
};

// get PayinTransaction by merchants

exports.getTodaysPayinTransaction = async (req, res) => {
  try {
    const merchantId = req.params.id;

    if (!merchantId) {
      return res
        .status(400)
        .json({ status: false, error: "Please Provide merchantId" });
    }

    const merchant = await User.findOne({ m_id: merchantId });
    const isPresent = req.user.resellers_merchant.includes(merchant._id);
    if (isPresent) {
      try {
        // Get today's date
        const today = new Date();
        // Set the time to the beginning of the day (00:00:00)
        today.setHours(0, 0, 0, 0);

        // Get tomorrow's date
        const tomorrow = new Date(today);
        // Set the time to the end of the day (23:59:59)
        tomorrow.setDate(today.getDate() + 1);
        tomorrow.setHours(23, 59, 59, 999);

        // Find transaction data for the current user within today's date range
        const TransactionsData = await PayinTransactionModel.find({
          m_id: merchantId,
          createdAt: { $gte: today, $lte: tomorrow },
        }).sort({ createdAt: -1 });

        if (TransactionsData.length > 0) {
          res.status(200).json({ status: true, data: TransactionsData });
        } else {
          res.status(404).json({ status: false, error: "no records found" });
        }
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get PayinTransaction of merchants by selecting date
exports.getPayinTransactionByDate = async (req, res) => {
  const merchantId = req.params.id;
  console.log(merchantId);
  if (!merchantId) {
    return res
      .status(400)
      .json({ status: false, error: "Please Provide merchantId" });
  }

  const merchant = await User.findOne({ m_id: merchantId });
  const isPresent = req.user.resellers_merchant.includes(merchant._id);
  if (isPresent) {
    try {
      // console.log(merchantId);
      // Extracting date filter parameters from the request query
      const { startDate, endDate } = req.query;

      // Validating the presence of startDate and endDate
      if (!startDate || !endDate) {
        return res
          .status(400)
          .json({ Error: "Both startDate and endDate are required" });
      }

      // // Parsing the date strings to Date objects and converting them to UTC
      // const start = new Date(startDate + "T00:00:00.000Z");
      // const end = new Date(endDate + "T23:59:59.999Z");

      const Transactions = await PayinTransactionModel.find({
        m_id: merchantId,
        createdAt: { $gte: startDate, $lte: endDate },
      }).sort({ createdAt: -1 });
      console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");

      console.log(Transactions);
      if (Transactions.length === 0) {
        return res
          .status(404)
          .json({ status: false, error: "no records found" });
      }

      // Sending the Transactions as the API response
      res.status(200).json({ status: true, data: Transactions });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(404).json({ error: " merchant not found" });
  }
};

/* -------------------------------------------------------------------------- */
/*                                   Payout                                   */
/* -------------------------------------------------------------------------- */

exports.getPayOutTransferByDate = async (req, res) => {
  const merchantId = req.params.id;
  console.log(merchantId);
  if (!merchantId) {
    return res
      .status(400)
      .json({ status: false, error: "Please Provide merchantId" });
  }

  const merchant = await User.findOne({ m_id: merchantId });
  const isPresent = req.user.resellers_merchant.includes(merchant._id);
  if (isPresent) {
    try {
      // console.log(merchantId);
      // Extracting date filter parameters from the request query
      const { startDate, endDate } = req.query;

      // Validating the presence of startDate and endDate
      if (!startDate || !endDate) {
        return res
          .status(400)
          .json({ Error: "Both startDate and endDate are required" });
      }

      // // Parsing the date strings to Date objects and converting them to UTC
      // const start = new Date(startDate + "T00:00:00.000Z");
      // const end = new Date(endDate + "T23:59:59.999Z");

      const Transactions = await PayoutTransactionModel.find({
        m_id: merchantId,
        createdAt: { $gte: startDate, $lte: endDate },
      }).sort({ createdAt: -1 });
      console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");

      console.log(Transactions);
      if (Transactions.length === 0) {
        return res
          .status(404)
          .json({ status: false, error: "no records found" });
      }

      // Sending the Transactions as the API response
      res.status(200).json({ status: true, data: Transactions });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(404).json({ error: " merchant not found" });
  }
};

exports.getTodaysPayOutTransfer = async (req, res) => {
  try {
    const merchantId = req.params.id;

    if (!merchantId) {
      return res
        .status(400)
        .json({ status: false, error: "Please Provide merchantId" });
    }

    const merchant = await User.findOne({ m_id: merchantId });
    const isPresent = req.user.resellers_merchant.includes(merchant._id);
    if (isPresent) {
      try {
        // Get today's date
        const today = new Date();
        // Set the time to the beginning of the day (00:00:00)
        today.setHours(0, 0, 0, 0);

        // Get tomorrow's date
        const tomorrow = new Date(today);
        // Set the time to the end of the day (23:59:59)
        tomorrow.setDate(today.getDate() + 1);
        tomorrow.setHours(23, 59, 59, 999);

        // Find transaction data for the current user within today's date range
        const TransactionsData = await PayoutTransactionModel.find({
          m_id: merchantId,
          createdAt: { $gte: today, $lte: tomorrow },
        }).sort({ createdAt: -1 });

        if (TransactionsData.length > 0) {
          res.status(200).json({ status: true, data: TransactionsData });
        } else {
          res.status(404).json({ status: false, error: "no records found" });
        }
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* -------------------------------------------------------------------------- */
/*                         merchant Toggle Activation                         */
/* -------------------------------------------------------------------------- */
exports.deActivateMerchant = async (req, res) => {
  try {
    const merchantId = req.params.id;
    const reseller = req.user;

    /* -------------------------------------------------------------------------- */
    /*                                my operation                                */
    /* -------------------------------------------------------------------------- */

    if (reseller) {
      const merchantObjId = await merchantModel.findOne({ m_id: merchantId });
      const merchant_str = merchantObjId._id.toString();
      const merchantExists = reseller.resellers_merchant.some(
        (id) => id.toString() === merchant_str
      );

      if (merchantExists) {
        // 3. Find and update the merchant document by merchant ID

        const merchant = await merchantModel.findOne({ m_id: merchantId });
        console.log("merchant===", merchant);
        if (!merchant.is_active) {
          const updateResult = await merchantModel.updateOne(
            { m_id: merchantId },
            { $set: { is_active: true } }
          );
          return res
            .status(200)
            .json({ status: true, message: "merchant activated successfully" });
        } else {
          updateResult = await merchantModel.updateOne(
            { m_id: merchantId },
            { $set: { is_active: false } }
          );

          return res.status(200).json({
            status: true,
            message: "merchant deactivated successfully",
          });
        }
      } else {
        return res.status(404).json({
          status: false,
          error: "Reseller does not created this merchant ",
        });
      }
    } else {
      return res.status(404).json({
        status: false,
        error: "Merchant ID not found in reseller's merchant array.",
      });
    }
    /* -------------------------------------------------------------------------- */
    /*                                   End                                    */
    /* -------------------------------------------------------------------------- */
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server error in reseller controller" });
  }
};

/* -------------------------------------------------------------------------- */
/*                                fund Statement                               */
/* -------------------------------------------------------------------------- */

exports.getTodaysfundStatement = async (req, res) => {
  try {
    const merchantId = req.params.id;

    if (!merchantId) {
      return res
        .status(400)
        .json({ status: false, error: "Please Provide merchantId" });
    }

    const merchant = await User.findOne({ m_id: merchantId });
    const isPresent = req.user.resellers_merchant.includes(merchant._id);
    if (isPresent) {
      // Get today's date
      const today = new Date();
      // Set the time to the beginning of the day (00:00:00)
      today.setHours(0, 0, 0, 0);

      // Get tomorrow's date
      const tomorrow = new Date(today);
      // Set the time to the end of the day (23:59:59)
      tomorrow.setDate(today.getDate() + 1);
      tomorrow.setHours(23, 59, 59, 999);

      // Find transaction data for the current user within today's date range
      const fundStatementsData = await fundModel
        .find({
          m_id: merchantId,
          createdAt: { $gte: today, $lte: tomorrow },
        })
        .sort({ createdAt: -1 });

      if (fundStatementsData.length > 0) {
        res.status(200).json({ status: true, data: fundStatementsData });
      } else {
        res.status(404).json({ status: false, error: "no records found" });
      }
    } else {
      res.status(400).json({ status: false, error: "Something went wrong" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getfundStatementByDate = async (req, res) => {
  try {
    const merchantId = req.params.id;

    if (!merchantId) {
      return res
        .status(400)
        .json({ status: false, error: "Please Provide merchantId" });
    }

    const merchant = await User.findOne({ m_id: merchantId });
    const isPresent = req.user.resellers_merchant.includes(merchant._id);
    if (isPresent) {
      // Extracting date filter parameters from the request query
      const { startDate, endDate } = req.query;

      // Validating the presence of startDate and endDate
      if (!startDate || !endDate) {
        return res
          .status(400)
          .json({ Error: "Both startDate and endDate are required" });
      }

      // Parsing the date strings to Date objects and converting them to UTC
      const start = new Date(startDate + "T00:00:00.000Z");
      const end = new Date(endDate + "T23:59:59.999Z");

      // Querying fundStatement with timestamps within the specified range
      const fundStatementsData = await fundModel
        .find({
          m_id: merchantId,
          createdAt: { $gte: start, $lte: end },
        })
        .sort({ createdAt: -1 });

      if (fundStatementsData.length === 0) {
        return res
          .status(404)
          .json({ status: false, error: "no records found" });
      }

      // Sending the fundStatementsData as the API response
      res.status(200).json({ status: true, data: fundStatementsData });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
