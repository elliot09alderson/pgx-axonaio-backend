// const WhiteListModel = require("../../models/payout/whitelist");
// const CreateWhiteListSchema = require("./zod/whitelistSchema");

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

// // Creating
// exports.createWhitelist = async (req, res) => {
//   try {
//     const merchantId = req.user.m_id;
//     const result = CreateWhiteListSchema.safeParse(req.body);
//     if (!result.success) {
//       return res
//         .status(400)
//         .json({ error: result.error.errors[0].message, success: false });
//     }
//     const { ip_address } = req.body;

//     // Validate request body
//     if (!ip_address) {
//       return res
//         .status(400)
//         .json({ status: false, error: "All required fields must be provided" });
//     }

//     // Check how many whitelist entries the user already has
//     const existingWhitelistCount = await WhiteListModel.countDocuments({
//       m_id: req.user._id,
//     });

//     // Check if the user has already reached the maximum limit of 5 whitelist entries
//     if (existingWhitelistCount >= 5) {
//       return res.status(400).json({
//         status: false,
//         error:
//           "You have reached the maximum limit of 5 IP addresses in the whitelist",
//       });
//     }

//     // Create new whitelist entry
//     const whitelist = await WhiteListModel.create({
//       whitelist_id: generateUNIQUEId(),
//       ip_address,
//       ip_addr_count: existingWhitelistCount + 1,
//       m_id: merchantId,
//     });

//     res
//       .status(201)
//       .json({ status: true, message: "created successfully", data: whitelist });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Get all
// exports.getAllWhitelist = async (req, res) => {
//   try {
//     const merchantId = req.user.m_id;

//     const whiteListData = await WhiteListModel.find({ m_id: merchantId });

//     if (whiteListData.length === 0) {
//       return res.status(400).json({
//         status: false,
//         error: "no records found",
//       });
//     }
//     // Remove the "ip_addr_count" key from each object in the whiteListData array

//     res.status(200).json({
//       status: true,
//       data: whiteListData, // Return the modified array without the "ip_addr_count" key
//       message: "fetched successfully",
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.updateWhiteList = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { ip_address } = req.body;

//     // Validate request body
//     if (!ip_address) {
//       return res
//         .status(400)
//         .json({ status: false, error: " All fields required" });
//     }

//     // Find the WhiteListModel by ID and update it
//     const whiteListData = await WhiteListModel.findOneAndUpdate(
//       { whitelist_id: id },
//       { ip_address },
//       { new: true }
//     ).select("-ip_addr_count");

//     if (!whiteListData) {
//       return res.status(404).json({ status: false, error: "no records found" });
//     }

//     res.status(200).json({
//       message: "updated successfully",
//       data: whiteListData,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
// //   // Deleting the IPs
// exports.deleteWhitelist = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Find the whitelist entry to be deleted
//     const whitelistEntry = await WhiteListModel.findOne({ whitelist_id: id });
//     // console.log(whitelistEntry)

//     // Check if the whitelist entry exists
//     if (!whitelistEntry) {
//       return res.status(404).json({ status: false, error: "no records found" });
//     }

//     // Check if the whitelist entry belongs to the current user
//     if (!whitelistEntry.m_id.equals(req.user._id)) {
//       return res.status(403).json({
//         status: false,
//         error: "You are not authorized to delete this whitelist entry",
//       });
//     }

//     // Delete the whitelist entry
//     await whitelistEntry.remove();

//     // Recalculate the count of remaining whitelist entries associated with the user
//     // const remainingWhitelistCount = await WhiteListModel.countDocuments({ m_id: req.user._id });

//     res
//       .status(304)
//       .json({ status: true, message: "Whitelist entry deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };




/* -------------------------------------------------------------------------- */
/*                  NEW CODE WITH LIVE AND TEST MODE FEATURES                 */
/* -------------------------------------------------------------------------- */
const {testPayoutWhitelist, livePayoutWhitelist} = require("../../models/payout/whitelist");


exports.createWhitelist = async (req, res) => {
  try {
    const { ip, mode } = req.body;

    // Validate request body
    if (!ip) {
      return res
        .status(400)
        .json({ status: false, error: "IP address is required" });
    }

    // Check if mode is provided and valid
    if (!mode || (mode !== "test" && mode !== "live")) {
      return res.status(400).json({
        status: false,
        error: "Please select a valid Mode ('test' or 'live')",
      });
    }

    const whitelistModel = mode === "test" ? testPayoutWhitelist : livePayoutWhitelist;

    // Check how many whitelist entries the user already has
    const existingWhitelistCount = await whitelistModel.countDocuments({
      m_id: req.user.m_id,
    });

    // Check if the user has already reached the maximum limit of 5 whitelist entries
    if (existingWhitelistCount >= 5) {
      return res.status(400).json({
        status: false,
        error:
          "You have reached the maximum limit of 5 IP addresses in the whitelist",
      });
    }

    // Create new whitelist entry
    const whitelist = await whitelistModel.create({
      whitelist_id: generateUNIQUEId(),
      ip_address: ip,
      ip_addr_count: existingWhitelistCount + 1,
      m_id: req.user.m_id,
    });

    res
      .status(201)
      .json({ status: true, message: "Created successfully", data: whitelist });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllWhitelist = async (req, res) => {
  try {
    const merchantId = req.user.m_id;
    const { mode } = req.query;

    // Check if mode is provided and valid
    if (!mode || (mode !== "test" && mode !== "live")) {
      return res.status(400).json({
        status: false,
        error: "Please select a valid Mode ('test' or 'live')",
      });
    }

    const whitelistModel = mode === "test" ? testPayoutWhitelist : livePayoutWhitelist;

    const pipeline = [
      { $match: { m_id: merchantId } }, // Match documents by merchant ID
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

    const whiteListData = await whitelistModel.aggregate(pipeline);

    if (whiteListData.length === 0) {
      return res.status(404).json({
        status: false,
        error: "No records found",
      });
    }

    // Remove the "ip_addr_count" key from each object in the whiteListData array
    const modifiedWhiteListData = whiteListData[0].documents.map((entry) => {
      const { ip_addr_count, ...rest } = entry;
      return rest;
    });

    res.status(200).json({
      status: true,
      data: modifiedWhiteListData,
      message: "Fetched successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateWhiteList = async (req, res) => {
  try {
    const { id } = req.params;
    const { ip, mode } = req.body;

    // Validate request body
    if (!ip) {
      return res.status(400).json({ status: false, error: "IP address is required" });
    }

    // Check if mode is provided and valid
    if (!mode || (mode !== "test" && mode !== "live")) {
      return res.status(400).json({
        status: false,
        error: "Please select a valid Mode ('test' or 'live')",
      });
    }

    const whitelistModel = mode === "test" ? testPayoutWhitelist : livePayoutWhitelist;

    // Find the whitelist entry by ID and update it
    const whiteListData = await whitelistModel.findOneAndUpdate(
      { whitelist_id: id },
      { ip_address: ip },
      { new: true }
    ).select("-ip_addr_count");

    if (!whiteListData) {
      return res.status(404).json({ status: false, error: "No records found" });
    }

    res.status(200).json({
      status: true,
      message: "Whitelist updated successfully",
      data: whiteListData,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteWhitelist = async (req, res) => {
  try {
    const { id } = req.params;
    const { mode } = req.query;
    const merchantId = req.user.m_id;

    // Check if mode is provided and valid
    if (!mode || (mode !== "test" && mode !== "live")) {
      return res.status(400).json({
        status: false,
        error: "Please select a valid Mode ('test' or 'live')",
      });
    }

    const whitelistModel = mode === "test" ? testPayoutWhitelist : livePayoutWhitelist;

    // Find the whitelist entry to be deleted
    const whitelistEntry = await whitelistModel.findOne({ whitelist_id: id });

    if (!whitelistEntry) {
      return res.status(404).json({ status: false, error: "No records found" });
    }

    // Check if the whitelist entry belongs to the current user
    if (whitelistEntry.m_id !== merchantId) {
      return res.status(403).json({
        status: false,
        error: "You are not authorized to delete this whitelist entry",
      });
    }

    // Delete the whitelist entry
    await whitelistEntry.remove();

    res.status(200).json({ status: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};