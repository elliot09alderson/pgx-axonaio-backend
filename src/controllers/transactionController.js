const TestTransaction = require("../models/TestTransactionSchema");

const { settlementFunction } = require("./settlementController");
const offset = 5.5 * 60 * 60 * 1000; // Offset for Indian Standard Time (IST)
const createTransaction = async (req, res, next) => {
  try {
    const {
      bank_ref_no,
      order_id,
      transaction_username,
      transaction_email,
      transaction_contact,
      transaction_amount,
      transaction_status,
      transaction_mode,
      transaction_notes,
      transaction_description,
      merchant_tax,
      goods_service_tax,
      created_employee,
      app_id,
      transaction_date,
    } = req.body;
    const transactionData = new TestTransaction({
      vendor_transaction_id: req.body.vender_transaction_gid ?? "",
      bank_ref_no,
      order_id,
      transaction_username,
      transaction_email,
      transaction_contact,
      transaction_amount,
      transaction_status,
      transaction_mode,
      transaction_notes,
      transaction_description,
      merchant_tax,
      goods_service_tax,
      created_employee,
      app_id,
      transaction_date: new Date(new Date(transaction_date).getTime() + offset),
      merchant_employee: req.user._id,
      transaction_flow: req.body.transaction_flow ?? "",
      transaction_device: req.body.transaction_device ?? "",
      udf1: req.body.udf1 ?? "",
      udf2: req.body.udf2 ?? "",
      udf3: req.body.udf3 ?? "",
      udf4: req.body.udf4 ?? "",
      udf5: req.body.udf5 ?? "",
    });
    const transaction = await transactionData.save();
    res.status(200).json(transaction);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const fetchTransactionsByFilter = async (req, res, next) => {
  try {
    let transactions;
    if (req.query.from && req.query.to) {
      const { from, to } = req.query;
      console.log("hi thhereeeee", req.query);
      transactions = await TestTransaction.aggregate([
        {
          $facet: {
            transaction_status: [
              {
                $match: {
                  merchant_employee: req.user._id.toString(),
                  createdAt: {
                    $gte: new Date(new Date(from).getTime() + offset),
                    $lte: new Date(new Date(to).getTime() + offset),
                  },
                },
              },
              {
                $group: {
                  _id: {
                    transaction_status: "$transaction_status",
                  },
                  detail: { $first: "$$ROOT" },
                  count: { $sum: 1 },
                },
              },
              {
                $replaceRoot: {
                  newRoot: {
                    $mergeObjects: [{ count: "$count" }, "$detail"],
                  },
                },
              },
            ],
            transaction_mode: [
              {
                $match: {
                  merchant_employee: req.user._id.toString(),
                  transaction_status: "success",
                  createdAt: {
                    $gte: new Date(new Date(from).getTime() + offset),
                    $lte: new Date(new Date(to).getTime() + offset),
                  },
                },
              },
              {
                $group: {
                  _id: "$transaction_mode",
                  count: { $sum: 1 },
                },
              },
            ],
            amount: [
              {
                $match: {
                  merchant_employee: req.user._id.toString(),
                  transaction_status: "success",
                  createdAt: {
                    $gte: new Date(new Date(from).getTime() + offset),
                    $lte: new Date(new Date(to).getTime() + offset),
                  },
                },
              },
            ],
            transaction_date: [
              {
                $match: {
                  merchant_employee: req.user._id.toString(),
                  transaction_status: "success",
                  createdAt: {
                    $gte: new Date(new Date(from).getTime() + offset),
                    $lte: new Date(new Date(to).getTime() + offset),
                  },
                },
              },
              {
                $group: {
                  _id: {
                    $dateToString: {
                      format: "%Y-%m-%d",
                      date: "$transaction_date",
                    },
                  },
                  detail: { $first: "$$ROOT" },
                  amount: { $sum: "$transaction_amount" },
                },
              },
              {
                $replaceRoot: {
                  newRoot: {
                    $mergeObjects: [
                      { count: "$count" },
                      "$detail",
                      { amount: "$amount" },
                    ],
                  },
                },
              },
            ],
          },
        },
      ]);
    }
    if (transactions.length) {
      let settlementData = await settlementFunction(req, res);
      res
        .status(200)
        .json({ settlementData: settlementData, transactions: transactions });
    } else {
      res.status(422).json({ message: "No transactions found", status: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const transactionFilterByStatusModeTypeDate = async (req, res) => {
  try {
    const { from, to, mode, status } = req.body;
    let query = {
      $and: [
        { merchant_employee: req.user._id },
        {
          transaction_mode: mode !== "all" ? mode : { $ne: "all" },
        },
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
    const transactionData = await TestTransaction.find(query);
    return transactionData;
  } catch (error) {
    return error;
  }
};

const fetchTransactionByAdmin = async (req, res) => {
  try {
    const { from, to } = req.query;
    transactions = await LiveTransaction.aggregate([
      {
        $facet: {
          failed_transaction: [
            {
              $match: {
                transaction_status: "failed",
                createdAt: {
                  $gte: new Date(new Date(from).getTime() + offset),
                  $lte: new Date(new Date(to).getTime() + offset),
                },
              },
            },
            {
              $group: {
                _id: "$transaction_status",
                count: { $sum: 1 },
              },
            },
          ],
          gtv: [
            {
              $match: {
                transaction_status: "success",
                createdAt: {
                  $gte: new Date(new Date(from).getTime() + offset),
                  $lte: new Date(new Date(to).getTime() + offset),
                },
              },
            },
            {
              $group: {
                _id: "$transaction_status",
                amount: { $sum: "$transaction_amount" },
                successful_transaction: { $sum: 1 },
              },
            },
          ],
          refund: [
            {
              $match: {
                transaction_status: "refund",
                createdAt: {
                  $gte: new Date(new Date(from).getTime() + offset),
                  $lte: new Date(new Date(to).getTime() + offset),
                },
              },
            },
            {
              $group: {
                _id: "$transaction_status",
                amount: { $sum: "$transaction_amount" },
              },
            },
          ],
          total_transaction: [
            {
              $match: {
                createdAt: {
                  $gte: new Date(new Date(from).getTime() + offset),
                  $lte: new Date(new Date(to).getTime() + offset),
                },
              },
            },
            {
              $group: {
                _id: null,
                count: { $sum: 1 },
              },
            },
          ],
        },
      },
    ]);

    res.status(200).json(transactions);
  } catch (error) {
    return error;
  }
};

const fetchGraphDataByAdmin = async (req, res) => {
  try {
    const { from, to } = req.query;
    transactions = await LiveTransaction.aggregate([
      {
        $facet: {
          bar_graph: [
            {
              $match: {
                transaction_status: "success",
                createdAt: {
                  $gte: new Date(new Date(from).getTime() + offset),
                  $lte: new Date(new Date(to).getTime() + offset),
                },
              },
            },
            {
              $group: {
                _id: {
                  $dateToString: {
                    format: "%Y-%m-%d",
                    date: "$transaction_date",
                  },
                },
                gtv_amount: { $sum: "$transaction_amount" },
                tran_count: { $sum: 1 },
              },
            },
            {
              $sort: { _id: 1 }, // sort by month in ascending order
            },
          ],
          pay_mode: [
            {
              $match: {
                createdAt: {
                  $gte: new Date(new Date(from).getTime() + offset),
                  $lte: new Date(new Date(to).getTime() + offset),
                },
              },
            },
            {
              $group: {
                _id: "$transaction_mode",
                total: { $sum: "$transaction_amount" },
              },
            },
          ],
        },
      },
    ]);
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: " server is down!" });
  }
};
module.exports = {
  createTransaction,
  fetchTransactionsByFilter,
  transactionFilterByStatusModeTypeDate,
  fetchTransactionByAdmin,
  fetchGraphDataByAdmin,
};
