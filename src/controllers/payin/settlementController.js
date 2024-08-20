const settlementModel = require("../../models/payin/settlement");

// exports.insertBulkSettlement = async (req, res) => {
//     try {

//       const settlement = await settlementModel.insertMany(data);
//       res.status(201).json({ message: 'Bulk settleMent created successfully', data: settlement });
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   }

exports.createSettlement = async (req, res) => {
  try {
    const merchantId = req.user.m_id;

    const {
      settlementDate,
      partnerId,
      merchantName,
      payeeVpa,
      cycle,
      timeoutCount,
      timeoutVolume,
      successCount,
      successVolume,
      totalCount,
      totalVolume,
      charges,
      chargeback,
      prevDayCreditAdj,
      netSettlement,
      transferred,
      fundReleased,
      cutOff,
      difference,
      utrNo,
      remarks,
    } = req.body;

    // Create new settlementModel
    const newSettlement = await settlementModel.create({
      settlementDate,
      partnerId,
      merchantName,
      payeeVpa,
      cycle,
      timeoutCount,
      timeoutVolume,
      successCount,
      successVolume,
      totalCount,
      totalVolume,
      charges,
      chargeback,
      prevDayCreditAdj,
      netSettlement,
      transferred,
      fundReleased,
      cutOff,
      difference,
      utrNo,
      remarks,
      m_id: merchantId, // Assuming req.user contains the authenticated user's information
    });

    res.status(201).json({
      message: "created successfully",
      data: newSettlement,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTodaysSettlement = async (req, res) => {
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
    const settlementsData = await settlementModel.find({
      m_id: merchantId,
      createdAt: { $gte: today, $lte: tomorrow },
    });

    if (settlementsData.length > 0) {
      res.status(200).json({ status: true, data: settlementsData });
    } else {
      res.status(404).json({ status: false, error: "no records found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSettlementByDate = async (req, res) => {
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

    // Querying Settlement with timestamps within the specified range
    const settlementsData = await settlementModel
      .find({
        m_id: merchantId,
        createdAt: { $gte: startDate, $lte: endDate },
      })
      .sort({ createdAt: -1 });

    if (settlementsData.length === 0) {
      return res.status(404).json({ status: false, error: "no records found" });
    }

    // Sending the settlementsData as the API response
    res.status(200).json({ status: true, data: settlementsData });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
