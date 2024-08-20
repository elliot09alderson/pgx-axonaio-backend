const fundModel = require("../../models/payout/fundStatement");

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

exports.createfundStatement = async (req, res) => {
  try {
    const merchantId = req.user.m_id;

    const {
      reference_id,
      amount,
      opening_balance,
      closing_balance,
      type,
      utr,
    } = req.body;

    // Validate request body
    if (
      !reference_id ||
      !amount ||
      !opening_balance ||
      !closing_balance ||
      !type ||
      !utr
    ) {
      return res
        .status(400)
        .json({ status: false, error: "All Fields  are required " });
    }

    // Create new fundModel
    const newfundStatement = await fundModel.create({
      fund_id: generateUNIQUEId(),
      reference_id,
      amount,
      opening_balance,
      closing_balance,
      type,
      utr,
      m_id: merchantId, // Assuming req.user contains the authenticated user's information
    });

    res.status(201).json({
      message: "created successfully",
      data: newfundStatement,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTodaysfundStatement = async (req, res) => {
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
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getfundStatementByDate = async (req, res) => {
  try {
    const merchantId = req.user.m_id;

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
      return res.status(404).json({ status: false, error: "no records found" });
    }

    // Sending the fundStatementsData as the API response
    res.status(200).json({ status: true, data: fundStatementsData });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
