// const {testPayinChargeback, livePayinChargeback} = require("../../models/payin/chargeback");

// // Create a new chargeback
// exports.createLiveChargeback = async (req, res) => {
//   try {
//     const mode = req.query.mode
//     if(!mode){return res.status(400).json({status:false, error:"Please select the Mode"})}

//     const merchantId = req.user.m_id;
//     const {
//       transaction_id,
//       chargeback_amount,
//       chargeback_type,
//       chargeback_status,
//       chargeback_respond,
//     } = req.body;

//     // Check if all required fields are present
//     if (
//       !transaction_id ||
//       !chargeback_amount ||
//       !chargeback_type ||
//       !chargeback_status
//     ) {
//       return res.status(400).json({
//         status: false,
//         error: "All required data fields are mandatory",
//       });
//     }

//     // Create new chargeback

//     const chargeback = await testPayinChargeback.create({
//       transaction_id,
//       chargeback_amount,
//       chargeback_type,
//       chargeback_status,
//       chargeback_respond,
//       m_id: merchantId,
//     });
//     res.status(201).json({ message: "created successfully", data: chargeback });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.getTodaysChargeback = async (req, res) => {
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

//     // Find chargeback data for the current user within today's date range
//     const chargebacks = await testPayinChargeback.find({
//       m_id: merchantId,
//       createdAt: { $gte: today, $lte: tomorrow },
//     }).sort({ createdAt: -1 });

//     if (chargebacks.length > 0) {
//       res.status(200).json({
//         status: true,
//         message: "fetched successfully",
//         data: chargebacks,
//       });
//     } else {
//       res.status(404).json({ status: false, error: "no records found" });
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.getChargebackByDate = async (req, res) => {
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

//     // Parsing the date strings to Date objects and converting them to UTC
//     // const start = new Date(startDate + "T00:00:00.000Z");
//     // const end = new Date(endDate + "T23:59:59.999Z");

//     // Querying chargebacks with timestamps within the specified range
//     const chargebacks = await testPayinChargeback.find({
//       m_id: merchantId,
//       createdAt: { $gte: startDate, $lte: endDate },
//     }).sort({ createdAt: -1 });

//     if (chargebacks.length === 0) {
//       return res.status(404).json({ status: false, error: "no records found" });
//     }

//     // Sending the chargebacks as the API response
//     res.status(200).json({ status: true, data: chargebacks });
//   } catch (error) {
//     res.status(500).json({ message: "Internal Server error" });
//   }
// };


/* -------------------------------------------------------------------------- */
/*                  NEW CODE WITH LIVE AND TEST MODE FEATURES                 */
/* -------------------------------------------------------------------------- */

const { testPayinChargeback, livePayinChargeback } = require("../../models/payin/chargeback");

// Helper function to get the correct model based on mode
function getChargebackModel(mode) {
  return mode === 'live' ? livePayinChargeback : testPayinChargeback;
}

// Create a new chargeback
exports.createChargeback = async (req, res) => {
  try {
    const mode = req.query.mode;
       // Check if mode is provided and valid
       if (!mode || (mode !== "test" && mode !== "live")) {
        return res.status(400).json({
          status: false,
          error: "Please select a valid Mode ('test' or 'live')",
        });
      }

    const merchantId = req.user.m_id;
    const {
      transaction_id,
      chargeback_amount,
      chargeback_type,
      chargeback_status,
      chargeback_respond,
    } = req.body;

    // Check if all required fields are present
    if (
      !transaction_id ||
      !chargeback_amount ||
      !chargeback_type ||
      !chargeback_status
    ) {
      return res.status(400).json({
        status: false,
        error: "All required data fields are mandatory",
      });
    }

    const ChargebackModel = getChargebackModel(mode);

    // Create new chargeback
    const chargeback = await ChargebackModel.create({
      transaction_id,
      chargeback_amount,
      chargeback_type,
      chargeback_status,
      chargeback_respond,
      m_id: merchantId,
    });

    res.status(201).json({ message: "Created successfully", data: chargeback });
  } catch (error) {
    res.status(500).json({ status:false,error: error.message });
  }
};

// Get today's chargebacks
exports.getTodaysChargeback = async (req, res) => {
  try {
    const mode = req.query.mode;
        // Check if mode is provided and valid
        if (!mode || (mode !== "test" && mode !== "live")) {
          return res.status(400).json({
            status: false,
            error: "Please select a valid Mode ('test' or 'live')",
          });
        }

    const merchantId = req.user.m_id;
    const ChargebackModel = getChargebackModel(mode);

    // Get today's date
    const today = new Date();
    // Set the time to the beginning of the day (00:00:00)
    today.setHours(0, 0, 0, 0);

    // Get tomorrow's date
    const tomorrow = new Date(today);
    // Set the time to the end of the day (23:59:59)
    tomorrow.setDate(today.getDate() + 1);
    tomorrow.setHours(23, 59, 59, 999);

    // Find chargeback data for the current user within today's date range
    const chargebacks = await ChargebackModel.find({
      m_id: merchantId,
      createdAt: { $gte: today, $lte: tomorrow },
    }).sort({ createdAt: -1 });

    if (chargebacks.length > 0) {
      res.status(200).json({
        status: true,
        message: "Fetched successfully",
        data: chargebacks,
      });
    } else {
      res.status(404).json({ status: false, error: "No records found" });
    }
  } catch (error) {
    res.status(500).json({ status:false,error: error.message });
  }
};

// Get chargebacks by date
exports.getChargebackByDate = async (req, res) => {
  try {
    const mode = req.query.mode;
      // Check if mode is provided and valid
      if (!mode || (mode !== "test" && mode !== "live")) {
        return res.status(400).json({
          status: false,
          error: "Please select a valid Mode ('test' or 'live')",
        });
      }

    const merchantId = req.user.m_id;
    const ChargebackModel = getChargebackModel(mode);

    // Extracting date filter parameters from the request query
    const { startDate, endDate } = req.query;

    // Validating the presence of startDate and endDate
    if (!startDate || !endDate) {
      return res.status(400).json({
        status: false,
        error: "Both startDate and endDate are required",
      });
    }

    // Querying chargebacks with timestamps within the specified range
    const chargebacks = await ChargebackModel.find({
      m_id: merchantId,
      createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
    }).sort({ createdAt: -1 });

    if (chargebacks.length === 0) {
      return res.status(404).json({ status: false, error: "No records found" });
    }

    // Sending the chargebacks as the API response
    res.status(200).json({ status: true, data: chargebacks });
  } catch (error) {
    res.status(500).json({ status:false,error: error.message });
  }
};
