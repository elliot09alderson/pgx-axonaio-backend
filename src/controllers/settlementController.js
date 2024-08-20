const TestSettlement = require("../models/TestSettlementSchema");
const TestTransaction = require("../models/TestTransactionSchema");
const offset = 5.5 * 60 * 60 * 1000; // Offset for Indian Standard Time (IST)
const createSettlement = async (req, res) => {
  try {
    const {
      settlement_receiptno,
      current_balance,
      settlement_fee,
      settlement_status,
      app_id,
      transaction_gid,
      settlement_date,
    } = req.body;
    const TransactionData = await TestTransaction.findOne({
      transaction_gid: transaction_gid,
    });
    const settlement_tax = Number(settlement_fee * 0.18).toFixed(2);
    const total_deduction = Number(settlement_fee) + Number(settlement_tax);
    const settlement_amount = Number(current_balance - total_deduction).toFixed(
      2
    );
    const settlementData = new TestSettlement({
      settlement_receiptno,
      current_balance,
      settlement_fee,
      settlement_tax,
      total_deduction,
      settlement_amount,
      app_id,
      settlement_status,
      merchant_employee: req.user._id,
      transaction_id: transaction_gid,
      settlement_date: new Date(new Date(settlement_date).getTime() + offset),
      transaction_date: TransactionData?.transaction_date,
    });
    const settlement = await settlementData.save();
    res.status(201).json(settlement);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};

// fetch data based on time
const fetchSettlementByFilter = async (req, res) => {
  try {
    let settlementData;
    const { from, to } = req.query;

    settlementData = await TestSettlement.aggregate([
      {
        $match: {
          settlement_date: {
            $gte: new Date(new Date(from).getTime() + offset),
            $lte: new Date(new Date(to).getTime() + offset),
          },
          merchant_employee: req.user._id,
        },
      },
      {
        $project: {
          settlement_date: 1,
          transaction_id: 1,
          transaction_date: 1,
          current_balance: 1,
          settlement_fee: 1,
          settlement_tax: 1,
          total_deduction: 1,
          settlement_amount: 1,
          settlement_status: 1,
          _id: 0,
        },
      },
      {
        $project: {
          "Settlement Date": "$settlement_date",
          "Transaction Id": "$transaction_id",
          "Transaction Date": "$transaction_date",
          Amount: "$current_balance",
          "Settlement Fee": "$settlement_fee",
          "Settlement Tax": "$settlement_tax",
          "Total Deduction": "$total_deduction",
          "Settlement Amount": "$settlement_amount",
          Status: "$settlement_status",
          _id: 0,
        },
      },
    ]);
    if (settlementData.length) {
      res.status(200).json(settlementData);
    } else {
      res.status(422).json({ message: "No transactions found", status: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// fetch the data from normal function
const settlementFunction = async (req, res) => {
  try {
    let settlementData;
    const { from, to } = req.query;
    settlementData = await TestSettlement.aggregate([
      {
        $match: {
          merchant_employee: req.user._id,
          settlement_date: {
            $gte: new Date(new Date(from).getTime() + offset),
            $lte: new Date(new Date(to).getTime() + offset),
          },
        },
      },
      {
        $group: {
          _id: "$settlement_status",
          count: { $sum: 1 },
        },
      },
    ]);
    if (settlementData.length) {
      return settlementData;
    } else {
      return { message: "No settlement found", status: false };
    }
  } catch (error) {
    return error;
  }
};

const settlementFilterByStatusModeTypeDate = async (req, res) => {
  try {
    const { from, to, status } = req.body;
    let query = {
      $and: [
        { merchant_employee: req.user._id },
        {
          settlement_status: status !== "all" ? status : { $ne: "all" },
        },
        {
          created_at: {
            $gte: new Date(new Date(from).getTime() + offset),
            $lte: new Date(new Date(to).getTime() + offset),
          },
        },
      ],
    };
    const settlementData = await TestSettlement.find(query);
    return settlementData;
  } catch (error) {
    return error;
  }
};
module.exports = {
  createSettlement,
  fetchSettlementByFilter,
  settlementFunction,
  settlementFilterByStatusModeTypeDate,
};
