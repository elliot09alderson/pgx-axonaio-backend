// const webhookOutModel = require("../../models/payout/webhook");

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
// const createWebhook = async (req, res) => {
//   try {
//     const merchantId = req.user.m_id;

//     const { webhook_url } = req.body;

//     // Validate request body
//     if (!webhook_url) {
//       return res
//         .status(400)
//         .json({ status: false, error: "Webhook URL is required " });
//     }

//     // Create a new webhook
//     const webhook = await webhookOutModel.create({
//       webhook_id: generateUNIQUEId(),
//       webhook_url,
//       m_id: merchantId,
//     });

//     res
//       .status(201)
//       .json({ status: true, message: "created successfully", data: webhook });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const get_webhook = async (req, res) => {
//   try {
//     const merchantId = req.user.m_id;

//     const pipeline = [
//       { $match: { m_id: merchantId } }, // Match documents by merchant ID
//       {
//         $group: {
//           _id: null,
//           documents: { $push: "$$ROOT" },
//           count: { $sum: 1 },
//         },
//       },
//       {
//         $project: {
//           _id: 0,
//           documents: 1,
//           count: 1,
//         },
//       },
//     ];

//     const webhookData = await webhookOutModel.aggregate(pipeline);

//     if (webhookData.length === 0) {
//       return res.status(404).json({ status: false, error: "no records found" });
//     }

//     res.status(200).json({
//       status: true,
//       data: webhookData[0].documents, // Return the 'documents' array containing all matched webhook data
//       message: "fetched successfully",
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const updateWebhook = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { webhook_url } = req.body;

//     // Validate request body
//     if (!webhook_url) {
//       return res
//         .status(400)
//         .json({ status: false, error: "Webhook URL is required fields" });
//     }

//     // Find the webhook by ID and update it
//     const webhook = await webhookOutModel.findOneAndUpdate(
//       { webhook_id: id },
//       { webhook_url },
//       { new: true }
//     );

//     if (!webhook) {
//       return res.status(404).json({ status: false, error: "no records found" });
//     }

//     res
//       .status(200)
//       .json({ status: true, message: "updated successfully", data: webhook });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const deleteWebhook = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const webhook = await webhookOutModel.findOneAndDelete({ webhook_id: id });

//     if (!webhook) {
//       return res.status(404).json({ status: false, error: "no records found" });
//     }

//     res.status(304).json({ status: true, message: "deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// module.exports = { createWebhook, get_webhook, updateWebhook, deleteWebhook };


const { testPayoutWebhook, livePayoutWebhook } = require("../../models/payout/webhook");

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

exports.createWebhook = async (req, res) => {
  try {
    const merchantId = req.user.m_id;
    const { webhook_url } = req.body;
    const mode = req.query.mode

    // Validate request body
    if (!webhook_url ) {
      return res
        .status(400)
        .json({ status: false, error: "All fields are required" });
    }

    // Check if mode is provided
        // Check if mode is provided and valid
        if (!mode || (mode !== "test" && mode !== "live")) {
          return res.status(400).json({
            status: false,
            error: "Please select a valid Mode ('test' or 'live')",
          });
        }

    const webhookModel = mode === "test" ? testPayoutWebhook : livePayoutWebhook;

    // Create a new webhook
    const webhook = await webhookModel.create({
      webhook_id: generateUNIQUEId(),
      webhook_url,
      m_id: merchantId,
    });

    res
      .status(201)
      .json({ status: true, message: "Created successfully", data: webhook });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.get_webhook = async (req, res) => {
  try {
    const merchantId = req.user.m_id;
    const mode = req.query.mode

     // Check if mode is provided and valid
     if (!mode || (mode !== "test" && mode !== "live")) {
      return res.status(400).json({
        status: false,
        error: "Please select a valid Mode ('test' or 'live')",
      });
    }

    const webhookModel = mode === "test" ? testPayoutWebhook : livePayoutWebhook;

    const pipeline = [
      { $match: { m_id: merchantId } },
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

    const webhookData = await webhookModel.aggregate(pipeline);

    if (webhookData.length === 0) {
      return res.status(404).json({ status: false, error: "No records found" });
    }

    res.status(200).json({
      data: webhookData[0].documents,
      message: "Fetched successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateWebhook = async (req, res) => {
  try {
    const { id } = req.params;
    const { webhook_url } = req.body;
    const mode = req.query.mode


    // Validate request body
    if (!webhook_url) {
      return res.status(400).json({
        status: false,
        error: "Webhook URL is a required field",
      });
    }

      // Check if mode is provided and valid
    if (!mode || (mode !== "test" && mode !== "live")) {
      return res.status(400).json({
        status: false,
        error: "Please select a valid Mode ('test' or 'live')",
      });
    }

    const webhookModel = mode === "test" ? testPayoutWebhook : livePayoutWebhook;

    // Find the webhook by ID and update it
    const webhook = await webhookModel.findOneAndUpdate(
      { webhook_id: id },
      { webhook_url },
      { new: true }
    );

    if (!webhook) {
      return res.status(404).json({ status: false, error: "No records found" });
    }

    res
      .status(200)
      .json({
        status: true,
        message: "Webhook updated successfully",
        data: webhook,
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteWebhook = async (req, res) => {
  try {
    const { id } = req.params;
    const mode = req.query.mode

       // Check if mode is provided and valid
       if (!mode || (mode !== "test" && mode !== "live")) {
        return res.status(400).json({
          status: false,
          error: "Please select a valid Mode ('test' or 'live')",
        });
      }

    const webhookModel = mode === "test" ? testPayoutWebhook : livePayoutWebhook;

    // Find the webhook by ID and delete it
    const webhook = await webhookModel.findOneAndDelete({ webhook_id: id });

    if (!webhook) {
      return res.status(404).json({ status: false, error: "No records found" });
    }

    res.status(200).json({ status: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};