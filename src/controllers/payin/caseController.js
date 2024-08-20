const caseModel = require("../../models/Payin/cases");
const transactionModel = require("../../models/Payin/PayinTransaction");

// FUNCTION FOR GENERATE UNIQUE ID
function generateUNIQUEId() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const minLength = 22;
  const maxLength = 24;
  const length =
    Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
  let uniqueId = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    uniqueId += characters.charAt(randomIndex);
  }

  return uniqueId;
}

// Create a new Cases
exports.createCase = async (req, res) => {
  try {
    const merchantId = req.user.m_id;
    console.log(req.user);
    const {
      // UTR,
      reference_id,
      transaction_id,
      case_from,
      case_type,
      name,
      email,
      mobile,
      location,
      description,
      case_station,
      station_officer_name,
      case_station_email,
      evidences,
      case_remark,
      case_status,
    } = req.body;

    // Check if all required fields are present
    if (
      // !UTR ||
      !reference_id ||
      !transaction_id ||
      !case_from ||
      !case_type ||
      !name ||
      !email ||
      !mobile ||
      !location ||
      !description ||
      !case_station ||
      !station_officer_name ||
      !case_station_email ||
      !evidences ||
      !case_remark ||
      !case_status
    ) {
      return res.status(400).json({
        status: false,
        error: "All required data fields are mandatory",
      });
    }

    // Create new cases

    // check the trainsactionId details

    const checkTransId = await transactionModel.findOne({
      transaction_id: transaction_id,
    });
    if (!checkTransId) {
      return res
        .status(400)
        .json({ status: false, error: "Incorrect Transaction Id" });
    }

    if (checkTransId.m_id != merchantId) {
      return res
        .status(403)
        .json({ status: false, error: "something went wrong" });
    }

    const Cases = await caseModel.create({
      case_id: generateUNIQUEId(),
      // UTR,
      reference_id,
      transaction_id,
      case_from,
      case_type,
      name,
      email,
      mobile,
      location,
      description,
      case_station,
      station_officer_name,
      case_station_email,
      evidences,
      case_remark,
      case_status,
      m_id: merchantId,
    });
    res.status(201).json({ message: "created successfully", data: Cases });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTodayCases = async (req, res) => {
  try {
    const merchantId = req.user.m_id;
    // Get today's date
    const today = new Date();
    // Set the time to the beginning of the day (00:00:00)
    today.setHours(0, 0, 0, 0);

    // Get tomorrow's date
    const tomorrow = new Date(today);
    // Set the time to the end of the day (23:59:59)
    tomorrow.setDate(today.getDate() + 1);
    tomorrow.setHours(23, 59, 59, 999);

    // Find Cases data for the current user within today's date range
    const cases = await caseModel
      .find({
        m_id: merchantId,
        createdAt: { $gte: today, $lte: tomorrow },
      })
      .sort({ createdAt: -1 });

    if (cases.length > 0) {
      res.status(200).json({
        status: true,
        message: "fetched successfully",
        data: cases,
      });
    } else {
      res.status(404).json({ status: false, error: "no records found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCasesByDate = async (req, res) => {
  try {
    const merchantId = req.user.m_id;

    // Extracting date filter parameters from the request query
    const { startDate, endDate } = req.query;

    // Validating the presence of startDate and endDate
    if (!startDate || !endDate) {
      return res.status(400).json({
        status: false,
        error: "Both startDate and endDate are required",
      });
    }

    // Querying cases with timestamps within the specified range
    const cases = await caseModel
      .find({
        m_id: merchantId,
        createdAt: { $gte: startDate, $lte: endDate },
      })
      .sort({ createdAt: -1 });

    if (cases.length === 0) {
      return res.status(404).json({ status: false, error: "no records found" });
    }

    // Sending the cases as the API response
    res.status(200).json({ status: true, data: cases });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
