// const {testPayoutBeneficiary, livePayoutBeneficiary} = require("../../models/payout/beneficiary");

// // FUNCTION FOR GENERATE UNIQUE ID
// function generateUNIQUEId() {
//   const characters =
//     "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//   const minLength = 22;
//   const maxLength = 24;
//   const length =
//     Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
//   let uniqueId = "ben_";

//   for (let i = 0; i < length; i++) {
//     const randomIndex = Math.floor(Math.random() * characters.length);
//     uniqueId += characters.charAt(randomIndex);
//   }

//   return uniqueId;
// }

// const createBeneficiary = async (req, res) => {
//   try {
//     const merchantId = req.user.m_id;

//     const {
//       ben_name,
//       ben_mobile,
//       ben_email,
//       ben_address,
//       ben_state,
//       ben_pincode,
//       ben_bank_acc,
//       ben_ifsc_code,
//     } = req.body;
//     console.log(req.body);

//     // Validate request body
//     if (
//       !ben_name ||
//       !ben_mobile ||
//       !ben_email ||
//       !ben_address ||
//       !ben_state ||
//       !ben_pincode ||
//       !ben_bank_acc ||
//       !ben_ifsc_code
//     ) {
//       return res
//         .status(400)
//         .json({ status: false, error: "All Fields  are required " });
//     }

//     const isAlreadyPresent = await beneficiaryModel.findOne({ ben_bank_acc });
//     if (isAlreadyPresent) {
//       return res.status(401).json({
//         status: false,
//         error: "Beneficiary already added please check",
//       });
//     }
//     // Create a new
//     const beneficiary = await beneficiaryModel.create({
//       ben_id: generateUNIQUEId(),
//       ben_name,
//       ben_mobile,
//       ben_email,
//       ben_address,
//       ben_state,
//       ben_pincode,
//       ben_bank_acc,
//       ben_ifsc_code,
//       m_id: merchantId,
//     });

//     return res.status(201).json({
//       status: true,
//       message: "created successfully",
//       data: beneficiary,
//     });
//   } catch (error) {
//     return res.status(500).json({ status: false, error: error.message });
//   }
// };

// const get_Beneficiary = async (req, res) => {
//   try {
//     const merchantId = req.user.m_id;

//     // Find chargeback data for the current user within today's date range
//     const chargebacks = await beneficiaryModel
//       .find({
//         m_id: merchantId,
//         // createdAt: { $gte: today, $lte: tomorrow },
//       })
//       .sort({ createdAt: -1 });

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

// const deleteBeneficiary = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Find the beneficiary by ID and delete it
//     const beneficiary = await beneficiaryModel.findOneAndDelete({ ben_id: id });

//     if (!beneficiary) {
//       return res.status(404).json({ status: false, error: "no records found" });
//     }

//     res.status(304).json({ status: true, message: "deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// module.exports = { createBeneficiary, get_Beneficiary, deleteBeneficiary };


/* -------------------- NEW CODE WITH TEST AND LIVE MODE -------------------- */

const { testPayoutBeneficiary, livePayoutBeneficiary } = require("../../models/payout/beneficiary");

// FUNCTION FOR GENERATE UNIQUE ID
function generateUNIQUEId() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const minLength = 22;
  const maxLength = 24;
  const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
  let uniqueId = "ben_";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    uniqueId += characters.charAt(randomIndex);
  }

  return uniqueId;
}

const createBeneficiary = async (req, res) => {
  try {
    const merchantId = req.user.m_id;
    const { 
      ben_name, 
      ben_mobile, 
      ben_email, 
      ben_address, 
      ben_state, 
      ben_pincode, 
      ben_bank_acc, 
      ben_ifsc_code, 
      mode 
    } = req.body;

    // Validate request body
    if (
      !ben_name || 
      !ben_mobile || 
      !ben_email || 
      !ben_address || 
      !ben_state || 
      !ben_pincode || 
      !ben_bank_acc || 
      !ben_ifsc_code
    ) {
      return res.status(400).json({ status: false, error: "All Fields are required" });
    }

    // Check if mode is provided and valid
    if (!mode || (mode !== "test" && mode !== "live")) {
      return res.status(400).json({
        status: false,
        error: "Please select a valid Mode ('test' or 'live')",
      });
    }

    const beneficiaryModel = mode === "test" ? testPayoutBeneficiary : livePayoutBeneficiary;

    // Check if the beneficiary is already present
    const isAlreadyPresent = await beneficiaryModel.findOne({ ben_bank_acc });
    if (isAlreadyPresent) {
      return res.status(401).json({
        status: false,
        error: "Beneficiary already added, please check",
      });
    }

    // Create a new beneficiary
    const beneficiary = await beneficiaryModel.create({
      ben_id: generateUNIQUEId(),
      ben_name,
      ben_mobile,
      ben_email,
      ben_address,
      ben_state,
      ben_pincode,
      ben_bank_acc,
      ben_ifsc_code,
      m_id: merchantId,
    });

    return res.status(201).json({
      status: true,
      message: "Beneficiary created successfully",
      data: beneficiary,
    });
  } catch (error) {
    return res.status(500).json({ status: false, error: error.message });
  }
};

const get_Beneficiary = async (req, res) => {
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

    const beneficiaryModel = mode === "test" ? testPayoutBeneficiary : livePayoutBeneficiary;

    // Find beneficiaries for the current user
    const beneficiaries = await beneficiaryModel
      .find({ m_id: merchantId })
      .sort({ createdAt: -1 });

    if (beneficiaries.length > 0) {
      return res.status(200).json({
        status: true,
        message: "Fetched successfully",
        data: beneficiaries,
      });
    } else {
      return res.status(404).json({ status: false, error: "No records found" });
    }
  } catch (error) {
    return res.status(500).json({ status: false, error: error.message });
  }
};

const deleteBeneficiary = async (req, res) => {
  try {
    const { id } = req.params;
    const { mode } = req.query;

    // Check if mode is provided and valid
    if (!mode || (mode !== "test" && mode !== "live")) {
      return res.status(400).json({
        status: false,
        error: "Please select a valid Mode ('test' or 'live')",
      });
    }

    const beneficiaryModel = mode === "test" ? testPayoutBeneficiary : livePayoutBeneficiary;

    // Find the beneficiary by ID and delete it
    const beneficiary = await beneficiaryModel.findOneAndDelete({ ben_id: id });

    if (!beneficiary) {
      return res.status(404).json({ status: false, error: "No records found" });
    }

    return res.status(200).json({ status: true, message: "Beneficiary deleted successfully" });
  } catch (error) {
    return res.status(500).json({ status: false, error: error.message });
  }
};

module.exports = { createBeneficiary, get_Beneficiary, deleteBeneficiary };
