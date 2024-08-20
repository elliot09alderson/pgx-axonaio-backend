// const {testPayoutTransfer, livePayoutTransfer} = require("../../models/payout/transfer");
// const beneficiaryModel = require("../../models/payout/beneficiary");

// // FUNCTION FOR GENERATE TRANSACTIONID
// function generateTransactionId() {
//   const characters =
//     "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//   const minLength = 18;
//   const maxLength = 24;
//   const length =
//     Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
//   let transactionId = "tid_";

//   for (let i = 0; i < length; i++) {
//     const randomIndex = Math.floor(Math.random() * characters.length);
//     transactionId += characters.charAt(randomIndex);
//   }

//   return transactionId;
// }
// // Creating
// exports.createTransfer = async (req, res) => {
//   try {
//     const merchantId = req.user.m_id;

//     const { transfer_method, amount, remark, ben_id } = req.body;

//     if (!transfer_method || !amount || !remark || !ben_id) {
//       return res
//         .status(400)
//         .json({ status: false, error: "All required fields must be provided" });
//     }
//     // Create new case

//     const beneficiary = await beneficiaryModel.findOne({ ben_id });
//     const transfer = await PayoutTransactionModel.create({
//       transaction_id: generateTransactionId(),
//       transfer_method,
//       payout_ifsc: beneficiary.ben_ifsc_code,
//       payout_bank_acc: beneficiary.ben_bank_acc,
//       payout_name: beneficiary.ben_name,
//       payout_phone: beneficiary.ben_mobile,
//       payout_email: beneficiary.ben_email,
//       amount,
//       remark,
//       ben_id,
//       m_id: merchantId,
//     });

//     res.status(201).json({
//       message: "created successfully",
//       data: transfer,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.getTodaysTransfer = async (req, res) => {
//   try {
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
//     const TransactionsData = await PayoutTransactionModel.find({
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

// exports.getTransferByDate = async (req, res) => {
//   try {
//     const merchantId = req.user.m_id;

//     // Extracting date filter parameters from the request query
//     const { startDate, endDate } = req.query;
//     console.log(startDate, endDate);

//     // Validating the presence of startDate and endDate
//     if (!startDate || !endDate) {
//       return res
//         .status(400)
//         .json({ Error: "Both startDate and endDate are required" });
//     }

//     const Transactions = await PayoutTransactionModel.find({
//       m_id: merchantId,
//       createdAt: { $gte: start, $lte: end },
//     }).sort({ createdAt: -1 });
//     console.log(Transactions);
//     if (Transactions.length === 0) {
//       return res.status(404).json({ status: false, error: "no records found" });
//     }

//     // Sending the Transactions as the API response
//     res.status(200).json({ status: true, data: Transactions });
//   } catch (error) {
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };


/* ---------------- NEW CODE WITH TEST AND LIVE MODE FEATURES --------------- */

const { testPayoutTransfer, livePayoutTransfer } = require("../../models/payout/transfer");
const beneficiaryModel = require("../../models/payout/beneficiary");

// FUNCTION FOR GENERATE TRANSACTION ID
function generateTransactionId() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const minLength = 18;
  const maxLength = 24;
  const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
  let transactionId = "tid_";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    transactionId += characters.charAt(randomIndex);
  }

  return transactionId;
}

// Create Transfer
exports.createTransfer = async (req, res) => {
  try {
    const merchantId = req.user.m_id;
    const { transfer_method, amount, remark, ben_id, mode } = req.body;

    // Validate required fields
    if (!transfer_method || !amount || !remark || !ben_id) {
      return res.status(400).json({ status: false, error: "All required fields must be provided" });
    }

    // Validate mode
    if (!mode || (mode !== "test" && mode !== "live")) {
      return res.status(400).json({ status: false, error: "Please select a valid Mode ('test' or 'live')" });
    }

    // Select the appropriate model based on the mode
    const PayoutTransactionModel = mode === "test" ? testPayoutTransfer : livePayoutTransfer;

    // Retrieve beneficiary details
    const beneficiary = await beneficiaryModel.findOne({ ben_id });
    if (!beneficiary) {
      return res.status(404).json({ status: false, error: "Beneficiary not found" });
    }

    // Create a new transfer record
    const transfer = await PayoutTransactionModel.create({
      transaction_id: generateTransactionId(),
      transfer_method,
      payout_ifsc: beneficiary.ben_ifsc_code,
      payout_bank_acc: beneficiary.ben_bank_acc,
      payout_name: beneficiary.ben_name,
      payout_phone: beneficiary.ben_mobile,
      payout_email: beneficiary.ben_email,
      amount,
      remark,
      ben_id,
      m_id: merchantId,
    });

    return res.status(201).json({
      status: true,
      message: "Transfer created successfully",
      data: transfer,
    });
  } catch (error) {
    return res.status(500).json({ status: false, error: error.message });
  }
};

// Get Today's Transfer
exports.getTodaysTransfer = async (req, res) => {
  try {
    const merchantId = req.user.m_id;
    const { mode } = req.query;

    // Validate mode
    if (!mode || (mode !== "test" && mode !== "live")) {
      return res.status(400).json({ status: false, error: "Please select a valid Mode ('test' or 'live')" });
    }

    // Select the appropriate model based on the mode
    const PayoutTransactionModel = mode === "test" ? testPayoutTransfer : livePayoutTransfer;

    // Get today's date and set the time range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    tomorrow.setHours(23, 59, 59, 999);

    // Retrieve today's transactions
    const TransactionsData = await PayoutTransactionModel.find({
      m_id: merchantId,
      createdAt: { $gte: today, $lte: tomorrow },
    }).sort({ createdAt: -1 });

    if (TransactionsData.length > 0) {
      return res.status(200).json({ status: true, data: TransactionsData });
    } else {
      return res.status(404).json({ status: false, error: "No records found" });
    }
  } catch (error) {
    return res.status(500).json({ status: false, error: error.message });
  }
};

// Get Transfer by Date
exports.getTransferByDate = async (req, res) => {
  try {
    const merchantId = req.user.m_id;
    const { startDate, endDate, mode } = req.query;

    // Validate required date parameters
    if (!startDate || !endDate) {
      return res.status(400).json({ status: false, error: "Both startDate and endDate are required" });
    }

    // Validate mode
    if (!mode || (mode !== "test" && mode !== "live")) {
      return res.status(400).json({ status: false, error: "Please select a valid Mode ('test' or 'live')" });
    }

    // Convert startDate and endDate to Date objects
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    // Select the appropriate model based on the mode
    const PayoutTransactionModel = mode === "test" ? testPayoutTransfer : livePayoutTransfer;

    // Retrieve transactions within the date range
    const Transactions = await PayoutTransactionModel.find({
      m_id: merchantId,
      createdAt: { $gte: start, $lte: end },
    }).sort({ createdAt: -1 });

    if (Transactions.length === 0) {
      return res.status(404).json({ status: false, error: "No records found" });
    }

    return res.status(200).json({ status: true, data: Transactions });
  } catch (error) {
    return res.status(500).json({ status: false, error: error.message });
  }
};
