// const PayinTransactionModel = require("../../models/Payin/PayinTransaction");

// // FUNCTION FOR GENERATE TRANSACTIONID
// function generateTransactionId() {
//   const characters =
//     "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//   const minLength = 18;
//   const maxLength = 24;
//   const length =
//     Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
//   let transactionId = "";

//   for (let i = 0; i < length; i++) {
//     const randomIndex = Math.floor(Math.random() * characters.length);
//     transactionId += characters.charAt(randomIndex);
//   }

//   return transactionId;
// }
// // Creating
// exports.createTransaction = async (req, res) => {
//   try {
//     const merchantId = req.user.m_id;

//     const {
//       vendor_transaction_id,
//       vendor_id,
//       bank_ref_no,
//       order_id,
//       transaction_response,
//       transaction_method_id,
//       transaction_type,
//       transaction_username,
//       transaction_email,
//       transaction_contact,
//       transaction_amount,
//       transaction_status,
//       transaction_mode,
//       transaction_notes,
//       transaction_description,
//       axonaio_tax,
//       goods_service_tax,
//       adjustment_done,
//       // transaction_date,
//       transaction_ip,
//       udf1,
//       udf2,
//       udf3,
//       udf4,
//       udf5,
//     } = req.body;

//     // Validate request body
//     if (
//       !transaction_method_id ||
//       !transaction_amount ||
//       !order_id
//       // !transaction_date
//     ) {
//       return res
//         .status(400)
//         .json({ status: false, error: "All required fields must be provided" });
//     }

//     const existingOrder = await PayinTransactionModel.find({ order_id });

//     let transactionAttempts = existingOrder.length + 1;

//     // Create new case
//     const transactionCreation = await PayinTransactionModel.create({
//       transaction_id: generateTransactionId(),
//       vendor_transaction_id,
//       vendor_id,
//       bank_ref_no,
//       order_id,
//       transaction_response,
//       transaction_method_id,
//       transaction_type,
//       transaction_username,
//       transaction_email,
//       transaction_contact,
//       transaction_amount,
//       transaction_status,
//       transaction_mode,
//       transaction_notes,
//       transaction_description,
//       axonaio_tax,
//       goods_service_tax,
//       adjustment_done,
//       // transaction_date,
//       transaction_ip,
//       transaction_attempts: transactionAttempts,
//       udf1,
//       udf2,
//       udf3,
//       udf4,
//       udf5,
//       m_id: merchantId,
//     });

//     res.status(201).json({
//       message: "created successfully",
//       data: transactionCreation,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.getTodaysTransaction = async (req, res) => {
//   try {
//     console.log("xxxxxxxxxxxxxxxxxxxxxxxxx");
//     const merchantId = req.user.m_id;

//     // Get today's date
//     const today = new Date();
//     // Set the time to the beginning of the day (00:00:00)
//     today.setHours(0, 0, 0, 0);

//     // Get tomorrow's date
//     const tomorrow = new Date(today);
//     // Set the time to the end of the day (23:59:59)
//     tomorrow.setDate(today.getDate() + 1);
//     tomorrow.setHours(23, 59, 59, 999);

//     // Find transaction data for the current user within today's date range
//     const TransactionsData = await PayinTransactionModel.find({
//       m_id: merchantId,
//       createdAt: { $gte: today, $lte: tomorrow },
//     }).sort({ createdAt: -1 });

//     if (TransactionsData.length > 0) {
//       res.status(200).json({ status: true, data: TransactionsData });
//     } else {
//       res.status(404).json({ status: false, error: "no records found" });
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.getTransactionByDate = async (req, res) => {
//   try {
//     const merchantId = req.user.m_id;
//     // console.log(merchantId);
//     const { startDate, endDate } = req.query;
//     // console.log(startDate, endDate);

//     // Validating the presence of startDate and endDate
//     if (!startDate || !endDate) {
//       return res
//         .status(400)
//         .json({ Error: "Both startDate and endDate are required" });
//     }

//     // // Parsing the date strings to Date objects and converting them to UTC
//     // const start = new Date(startDate + "T00:00:00.000Z");
//     // const end = new Date(endDate + "T23:59:59.999Z");

//     const Transactions = await PayinTransactionModel.find({
//       m_id: merchantId,
//       createdAt: { $gte: startDate, $lte: endDate },
//     }).sort({ createdAt: -1 });
//     // console.log("Transactions by date", Transactions);
//     if (Transactions.length === 0) {
//       return res.status(404).json({ status: false, error: "no records found" });
//     }

//     // Sending the Transactions as the API response
//     res.status(200).json({ status: true, data: Transactions });
//   } catch (error) {
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

/* ---------------- NEW CODE WITH LIVE AND TEST MODE FEATURES --------------- */

const { testPayinTransaction, livePayinTransaction } = require("../../models/Payin/PayinTransaction");

// FUNCTION FOR GENERATE TRANSACTIONID
function generateTransactionId() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const minLength = 18;
  const maxLength = 24;
  const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
  let transactionId = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    transactionId += characters.charAt(randomIndex);
  }

  return transactionId;
}

// Helper function to get the correct model based on the mode
function getTransactionModel(mode) {
  return mode === 'live' ? livePayinTransaction : testPayinTransaction;
}

// Creating a transaction
exports.createTransaction = async (req, res) => {
  try {
    const mode = req.query.mode;
        // Check if mode is provided and valid
    if (!mode || (mode !== "test" && mode !== "live")) {
      return res.status(400).json({
        status: false,
        error: "Please select a valid Mode ('test' or 'live')",
      });
    }

    const PayinTransactionModel = getTransactionModel(mode);
    const merchantId = req.user.m_id;

    const {
      vendor_transaction_id,
      vendor_id,
      bank_ref_no,
      order_id,
      transaction_response,
      transaction_method_id,
      transaction_type,
      transaction_username,
      transaction_email,
      transaction_contact,
      transaction_amount,
      transaction_status,
      transaction_mode,
      transaction_notes,
      transaction_description,
      axonaio_tax,
      goods_service_tax,
      adjustment_done,
      transaction_ip,
      udf1,
      udf2,
      udf3,
      udf4,
      udf5,
    } = req.body;

    // Validate request body
    if (!transaction_method_id || !transaction_amount || !order_id) {
      return res.status(400).json({ status: false, error: "All required fields must be provided" });
    }

    // Find previous transactions for the same order_id
    const existingOrder = await PayinTransactionModel.find({ order_id });
    if(existingOrder.length==0){
      return res.status(404).json({status:false, error:"no records found"})
    }

    let transactionAttempts = existingOrder.length + 1;

    // Create new transaction
    const transactionCreation = await PayinTransactionModel.create({
      transaction_id: generateTransactionId(),
      vendor_transaction_id,
      vendor_id,
      bank_ref_no,
      order_id,
      transaction_response,
      transaction_method_id,
      transaction_type,
      transaction_username,
      transaction_email,
      transaction_contact,
      transaction_amount,
      transaction_status,
      transaction_mode,
      transaction_notes,
      transaction_description,
      axonaio_tax,
      goods_service_tax,
      adjustment_done,
      transaction_ip,
      transaction_attempts: transactionAttempts,
      udf1,
      udf2,
      udf3,
      udf4,
      udf5,
      m_id: merchantId,
    });

    res.status(201).json({
      message: "Transaction created successfully",
      data: transactionCreation,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get today's transactions
exports.getTodaysTransaction = async (req, res) => {
  try {
    const mode = req.query.mode;
        // Check if mode is provided and valid
    if (!mode || (mode !== "test" && mode !== "live")) {
      return res.status(400).json({
        status: false,
        error: "Please select a valid Mode ('test' or 'live')",
      });
    }

    const PayinTransactionModel = getTransactionModel(mode);
    const merchantId = req.user.m_id;

    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get tomorrow's date
    const tomorrow = new Date(today);
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
      res.status(404).json({ status: false, error: "No records found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get transactions by date range
exports.getTransactionByDate = async (req, res) => {
  try {
    const mode = req.query.mode;
        // Check if mode is provided and valid
    if (!mode || (mode !== "test" && mode !== "live")) {
      return res.status(400).json({
        status: false,
        error: "Please select a valid Mode ('test' or 'live')",
      });
    }

    const PayinTransactionModel = getTransactionModel(mode);
    const merchantId = req.user.m_id;

    const { startDate, endDate } = req.query;

    // Validating the presence of startDate and endDate
    if (!startDate || !endDate) {
      return res.status(400).json({ Error: "Both startDate and endDate are required" });
    }

    // Find transactions within the specified date range
    const Transactions = await PayinTransactionModel.find({
      m_id: merchantId,
      createdAt: { $gte: startDate, $lte: endDate },
    }).sort({ createdAt: -1 });

    if (Transactions.length === 0) {
      return res.status(404).json({ status: false, error: "No records found" });
    }

    // Sending the Transactions as the API response
    res.status(200).json({ status: true, data: Transactions });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
