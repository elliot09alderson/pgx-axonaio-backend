// const {testRefund, liveRefund} = require("../../models/Payin/refund");
// const {testPayinTransaction, livePayinTransaction} = require("../../models/Payin/PayinTransaction");

// // FUNCTION FOR GENERATE UNIQUE ID
// function generateUNIQUEId() {
//   const characters =
//     "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//   const minLength = 22;
//   const maxLength = 24;
//   const length =
//     Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
//   let uniqueId = "";

//   for (let i = 0; i < length; i++) {
//     const randomIndex = Math.floor(Math.random() * characters.length);
//     uniqueId += characters.charAt(randomIndex);
//   }

//   return uniqueId;
// }
// const createrefund = async (req, res) => {
//   try {
//     const merchantId = req.user.m_id;

//     const { transaction_id, refund_amount, refund_status } = req.body;

//     // Validate request body
//     if (!transaction_id || !refund_amount || !refund_status) {
//       return res
//         .status(400)
//         .json({ status: false, error: "all fields is required " });
//     }

//     // check the trainsactionId details

//     const checkTransId = await transactionModel.findOne({
//       transaction_id: transaction_id,
//     });
//     if (!checkTransId) {
//       return res
//         .status(400)
//         .json({ status: false, error: "Incorrect Transaction Id" });
//     }

//     if (checkTransId.m_id != merchantId) {
//       return res
//         .status(403)
//         .json({ status: false, error: "something went wrong" });
//     }

//     // Create a new refund
//     const refund = await refundModel.create({
//       refund_id: generateUNIQUEId(),
//       transaction_id,
//       refund_amount,
//       refund_status,
//       m_id: merchantId,
//     });

//     res
//       .status(201)
//       .json({ status: true, message: "created successfully", data: refund });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const get_refund = async (req, res) => {
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

//     // Find refund data for the current user within today's date range
//     const refund = await refundModel
//       .find({
//         m_id: merchantId,
//         createdAt: { $gte: today, $lte: tomorrow },
//       })
//       .sort({ createdAt: -1 });

//     if (refund.length > 0) {
//       res.status(200).json({
//         status: true,
//         message: "fetched successfully",
//         data: refund,
//       });
//     } else {
//       res.status(404).json({ status: false, error: "no records found" });
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const getrefundByDate = async (req, res) => {
//   try {
//     const merchantId = req.user.m_id;

//     // Extracting date filter parameters from the request query
//     const { startDate, endDate } = req.query;

//     // Validating the presence of startDate and endDate
//     if (!startDate || !endDate) {
//       return res.status(400).json({
//         status: false,
//         error: "Both startDate and endDate are required",
//       });
//     }

//     // Querying refund with timestamps within the specified range
//     const refund = await refundModel.find({
//       m_id: merchantId,
//       createdAt: { $gte: startDate, $lte: endDate },
//     });

//     if (refund.length === 0) {
//       return res.status(404).json({ status: false, error: "no records found" });
//     }

//     // Sending the refund as the API response
//     res.status(200).json({ status: true, data: refund });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const updaterefund = async (req, res) => {
//   try {
//     // console.log(req.params);
//     // console.log("body", req.body);

//     const { id } = req.params;
//     const { refund_status } = req.body;

//     // Validate request body
//     if (!refund_status) {
//       return res
//         .status(400)
//         .json({ status: false, error: "all required fields" });
//     }

//     // Find the refund by ID and update it
//     const refund = await refundModel.findOneAndUpdate(
//       { refund_id: id },
//       { refund_status },
//       { new: true }
//     );
//     // console.log(refund);

//     if (!refund) {
//       return res.status(404).json({ status: false, error: "no records found" });
//     }

//     res
//       .status(200)
//       .json({
//         status: true,
//         message: "refund updated successfully",
//         data: refund,
//       });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const deleterefund = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Find the refund by ID and delete it
//     const refund = await refundModel.findOneAndDelete({ refund_id: id });
//     // console.log("deleted ip ", refund);
//     if (!refund) {
//       return res.status(404).json({ status: false, error: "no records found" });
//     }

//     res.status(304).json({ status: true, message: "deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// module.exports = {
//   createrefund,
//   get_refund,
//   getrefundByDate,
//   updaterefund,
//   deleterefund,
// };

/* -------------------------------------------------------------------------- */
/*                NEW CODE WITH THE LIVE AND TEST MODE FEATURES               */
/* -------------------------------------------------------------------------- */

const { testRefund, liveRefund } = require("../../models/Payin/refund");
const { testPayinTransaction, livePayinTransaction } = require("../../models/Payin/PayinTransaction");

// FUNCTION FOR GENERATE UNIQUE ID
function generateUNIQUEId() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const minLength = 22;
  const maxLength = 24;
  const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
  let uniqueId = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    uniqueId += characters.charAt(randomIndex);
  }

  return uniqueId;
}

// Helper function to get the correct model based on mode
function getModels(mode) {
  if (mode === 'live') {
    return { refundModel: liveRefund, transactionModel: livePayinTransaction };
  }
  return { refundModel: testRefund, transactionModel: testPayinTransaction };
}

exports.createRefund = async (req, res) => {
  try {
    const merchantId = req.user.m_id;
    const { mode } = req.query;  // 'live' or 'test'
        // Check if mode is provided and valid
    if (!mode || (mode !== "test" && mode !== "live")) {
      return res.status(400).json({
        status: false,
        error: "Please select a valid Mode ('test' or 'live')",
      });
    }

    const { refundModel, transactionModel } = getModels(mode);

    const { transaction_id, refund_amount, refund_status } = req.body;

    // Validate request body
    if (!transaction_id || !refund_amount || !refund_status) {
      return res.status(400).json({ status: false, error: "all fields are required" });
    }

    // Check the transactionId details
    const checkTransId = await transactionModel.findOne({ transaction_id });
    if (!checkTransId) {
      return res.status(400).json({ status: false, error: "Incorrect Transaction Id" });
    }

    if (checkTransId.m_id !== merchantId) {
      return res.status(403).json({ status: false, error: "something went wrong" });
    }

    // Create a new refund
    const refund = await refundModel.create({
      refund_id: generateUNIQUEId(),
      transaction_id,
      refund_amount,
      refund_status,
      m_id: merchantId,
    });

    res.status(201).json({ status: true, message: "created successfully", data: refund });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.get_Refund = async (req, res) => {
  try {
    const merchantId = req.user.m_id;
    const { mode } = req.query;  // 'live' or 'test'
        // Check if mode is provided and valid
    if (!mode || (mode !== "test" && mode !== "live")) {
      return res.status(400).json({
        status: false,
        error: "Please select a valid Mode ('test' or 'live')",
      });
    }

    const { refundModel } = getModels(mode);

    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    tomorrow.setHours(23, 59, 59, 999);

    // Find refund data for the current user within today's date range
    const refund = await refundModel.find({
      m_id: merchantId,
      createdAt: { $gte: today, $lte: tomorrow },
    }).sort({ createdAt: -1 });

    if (refund.length > 0) {
      res.status(200).json({
        status: true,
        message: "fetched successfully",
        data: refund,
      });
    } else {
      res.status(404).json({ status: false, error: "no records found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRefundByDate = async (req, res) => {
  try {
    const merchantId = req.user.m_id;
    const { mode } = req.query;  // 'live' or 'test'
        // Check if mode is provided and valid
    if (!mode || (mode !== "test" && mode !== "live")) {
      return res.status(400).json({
        status: false,
        error: "Please select a valid Mode ('test' or 'live')",
      });
    }

    const { refundModel } = getModels(mode);

    const { startDate, endDate } = req.query;

    // Validating the presence of startDate and endDate
    if (!startDate || !endDate) {
      return res.status(400).json({
        status: false,
        error: "Both startDate and endDate are required",
      });
    }

    // Querying refund with timestamps within the specified range
    const refund = await refundModel.find({
      m_id: merchantId,
      createdAt: { $gte: startDate, $lte: endDate },
    });

    if (refund.length === 0) {
      return res.status(404).json({ status: false, error: "no records found" });
    }

    // Sending the refund as the API response
    res.status(200).json({ status: true, data: refund });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateRefund = async (req, res) => {
  try {
    const { id } = req.params;
    const { refund_status } = req.body;
    const { mode } = req.query;  // 'live' or 'test'
        // Check if mode is provided and valid
    if (!mode || (mode !== "test" && mode !== "live")) {
      return res.status(400).json({
        status: false,
        error: "Please select a valid Mode ('test' or 'live')",
      });
    }

    const { refundModel } = getModels(mode);

    // Validate request body
    if (!refund_status) {
      return res.status(400).json({ status: false, error: "all required fields" });
    }

    // Find the refund by ID and update it
    const refund = await refundModel.findOneAndUpdate(
      { refund_id: id },
      { refund_status },
      { new: true }
    );

    if (!refund) {
      return res.status(404).json({ status: false, error: "no records found" });
    }

    res.status(200).json({
      status: true,
      message: "refund updated successfully",
      data: refund,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteRefund = async (req, res) => {
  try {
    const { id } = req.params;
    const { mode } = req.query;  // 'live' or 'test'
        // Check if mode is provided and valid
    if (!mode || (mode !== "test" && mode !== "live")) {
      return res.status(400).json({
        status: false,
        error: "Please select a valid Mode ('test' or 'live')",
      });
    }
    const { refundModel } = getModels(mode);

    // Find the refund by ID and delete it
    const refund = await refundModel.findOneAndDelete({ refund_id: id });
    if (!refund) {
      return res.status(404).json({ status: false, error: "no records found" });
    }

    res.status(304).json({ status: true, message: "deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


