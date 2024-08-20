const Order = require("../models/OrderSchema");
const { v4: uuidv4 } = require("uuid");
const moment = require("moment-timezone");
const axios = require("axios");
const offset = 5.5 * 60 * 60 * 1000; // Offset for Indian Standard Time (IST)
const orderCreate = async (req, res) => {
  try {
    const { amount, createdAt, customerPhone } = req.body;

    const orderData = new Order({
      amount,
      createdAt: new Date(new Date(createdAt).getTime() + offset),
      customerEmail: req.body.customerEmail ?? "",
      customerName: req.body.customerName ?? "",
      customerPhone,
      notes: req.body.notes ?? "",
      orderId: "FXPay_" + uuidv4(),
      paymentRequestId: req.body.paymentRequestId,
      paymentRequestReferenceId: req.body.paymentRequestReferenceId ?? "",
      paymentStatus: req.body.paymentStatus,
      transactionId: req.body.transactionId ?? "",
      transactionStatus: req.body.transactionStatus ?? "",
      merchant_employee: req.user._id,
    });
    const order = await orderData.save();
    if (order) {
      res.status(201).json(order);
    } else {
      res.status(422).json({ message: "some error occur!" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server is error!" });
  }
};

const fetchOrderd = async (req, res) => {
  try {
    const { from, to } = req.query;
    let orderData = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date(from).getTime() + offset),
            $lte: new Date(new Date(to).getTime() + offset),
          },
          merchant_employee: req.user._id,
        },
      },
      {
        $project: {
          amount: 1,
          createdAt: 1,
          customerEmail: 1,
          customerName: 1,
          customerPhone: 1,
          notes: 1,
          orderId: 1,
          paymentRequestId: 1,
          paymentRequestReferenceId: 1,
          paymentStatus: 1,
          transactionId: 1,
          transactionStatus: 1,
        },
      },
      {
        $project: {
          "Date & Time": "$createdAt",
          "Order ID": "$orderId",
          "FX Link ID": "$paymentRequestId",
          "Phone No": "$customerPhone",
          "Email ID": "$customerEmail",
          Status: "$paymentStatus",
          "Link ID": "$paymentRequestReferenceId",
          Amount: "$amount",
          "Transaction ID": "$transactionId",
          transactionStatus: "$transactionStatus",
          notes: "$notes",
          customerName: "$customerName",
        },
      },
    ]);
    if (orderData.length) {
      res.status(200).json(orderData);
    } else {
      res.status(422).json({ message: "No order found", status: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server is error!" });
  }
};

const upiCheck = async (req, res) => {
  try {
    const upiId = req.query.upiId;
    const response = await axios.get(
      `https://upichk.npci.org.in/api/v1/lookup/${upiId}`
    );
    if (response.data.status === "SUCCESS") {
      res.json({
        status: "SUCCESS",
        name: response.data.data.name,
      });
    } else {
      res.json({
        status: "FAILURE",
        error: response.data.data.message,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server is down!" });
  }
};

module.exports = {
  orderCreate,
  fetchOrderd,
  upiCheck,
};
