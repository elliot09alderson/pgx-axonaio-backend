const Chargeback = require("../models/liveChargeback");
const mongoose = require("mongoose");
// Create a new chargeback
exports.createLiveChargeback = async (req, res) => {
  try {
    const {
      chargeback_gid,
      transaction_gid,
      chargeback_amount,
      chargeback_type,
      chargeback_status,
      chargeback_respond,
      user_id,
    } = req.body;

    // Check if all required fields are present
    if (
      !chargeback_gid ||
      !transaction_gid ||
      !chargeback_amount ||
      !chargeback_type ||
      !chargeback_status ||
      !user_id
    ) {
      return res.status(400).json({
        status: false,
        Error: "All required data fields are mandatory",
      });
    }

    // Create new chargeback

    const chargeback = await Chargeback.create({
      chargeback_gid,
      transaction_gid,
      chargeback_amount,
      chargeback_type,
      chargeback_status,
      chargeback_respond,
      user_id: req.user._id,
    });
    res
      .status(201)
      .json({ message: "Chargeback created successfully", data: chargeback });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all chargebacks
exports.getAllChargeback = async (req, res) => {
  try {
    limit = 100;
    skip = 0;
    const pipeline = [
      { $skip: skip },
      { $limit: limit },
      {
        $group: {
          _id: null,
          documents: { $push: "$$ROOT" },
          count: { $sum: 1 },
        },
      },

      {
        $project: {
          _id: 0,
          documents: 1,
          count: 1,
        },
      },
    ];
    const chargebacks = await Chargeback.aggregate(pipeline);
    if (chargebacks) {
      console.log({ chargebackData: chargebacks });
      res.status(200).json({ chargebackData: chargebacks });
    } else {
      res.status(401).json({ message: "chargebacks not found!" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateChargeback = async (req, res) => {
  try {
    const {
      chargeback_gid,
      transaction_gid,
      chargeback_amount,
      chargeback_type,
      chargeback_status,
      chargeback_respond,
      user_id,
    } = req.body;
    const chargebackDatatwo = {
      chargeback_gid,
      transaction_gid,
      chargeback_amount,
      chargeback_type,
      chargeback_status,
      chargeback_respond,
      user_id: req.user._id,
    };
    const chargebackDetails = await Chargeback.updateOne(
      { user_id: req.user._id },
      chargebackDatatwo,
      { upsert: true }
    );
    if (chargebackDetails) {
      return res.status(200).send({
        message: "chargeback details updated successfully!",
        result: true,
      });
    } else {
      res.status(401).json({ messaage: "Details is still not updated!" });
    }
  } catch (err) {
    return res.status(500).send({ message: err.message, result: false });
  }
};
