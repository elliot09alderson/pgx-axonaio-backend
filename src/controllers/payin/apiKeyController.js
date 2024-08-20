/* -------------------- OLD CONTROLLER CODE FOR ONLY TEST ------------------- */


// const { testPayinApiKey, livePayinApiKey } = require("../../models/Payin/apikeys");


// // Helper function to generate API keys
// function generateApiKey() {
//   const characters =
//     "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//   const length = 18; // Length of the API key
//   let apiKey = "";

//   for (let i = 0; i < length; i++) {
//     const randomIndex = Math.floor(Math.random() * characters.length);
//     apiKey += characters.charAt(randomIndex);
//   }

//   return apiKey;
// }

// exports.generateApiKeys = async (req, res) => {
//   try {
//     const merchantId = req.user.m_id;
//     console.log(req.user.m_id);
//     const apiData = {
//       m_id: merchantId,
//       mid_key: generateApiKey(),
//       salt_key: generateApiKey(),
//       secret_key: generateApiKey(),
//       AES_key: generateApiKey(),
//     };

//     await testPayinApiKey.updateOne({ m_id: merchantId }, apiData, {
//       upsert: true,
//     });

//     const keysData = await testPayinApiKey.findOne({ m_id: merchantId });

//     if (keysData) {
//       return res.status(200).json({
//         message: "Api details  updated successfully!",
//         result: true,
//         data: keysData,
//       });
//     } else {
//       res
//         .status(401)
//         .json({ staus: false, error: "Details is still not updated!" });
//     }
//   } catch (err) {
//     return res.status(500).send({ error: err.message });
//   }
// };



// exports.get_apiKey = async (req, res) => {
//   try {
//     const merchantId = req.user.m_id;

//     const apiKeyData = await testPayinApiKey.find({ m_id: merchantId });

//     if (apiKeyData.length === 0) {
//       return res.status(404).json({ status: false, error: "no records found" });
//     }

//     res.status(200).json({
//       status: true,
//       data: apiKeyData,
//       message: "fetched successfully",
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

/* -------------------------------------------------------------------------- */
/*                                   BREAKUP                                  */
/* -------------------------------------------------------------------------- */

/* ------------ THIS CODE INCLUDES TEST & LIVE MODE FUNCTIONALITY ----------- */
const { testPayinApiKey, livePayinApiKey } = require("../../models/Payin/apikeys");

// Helper function to generate API keys
function generateApiKey() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const length = 18; // Length of the API key
  let apiKey = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    apiKey += characters.charAt(randomIndex);
  }

  return apiKey;
}

// Helper function to get the correct model based on mode
function getApiKeyModel(mode) {
  return mode === 'live' ? livePayinApiKey : testPayinApiKey;
}

// Generate API keys
exports.generateApiKeys = async (req, res) => {
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
    const ApiKeyModel = getApiKeyModel(mode);

    const apiData = {
      m_id: merchantId,
      mid_key: generateApiKey(),
      salt_key: generateApiKey(),
      secret_key: generateApiKey(),
      AES_key: generateApiKey(),
    };

    await ApiKeyModel.updateOne({ m_id: merchantId }, apiData, {
      upsert: true,
    });

    const keysData = await ApiKeyModel.findOne({ m_id: merchantId });

    if (keysData) {
      return res.status(200).json({
        message: "API details updated successfully!",
        result: true,
        data: keysData,
      });
    } else {
      return res.status(401).json({
        status: false,
        error: "Details have not been updated!",
      });
    }
  } catch (error) {
    return res.status(500).json({ status:false, error: error.message });
  }
};

// Get API keys
exports.get_apiKey = async (req, res) => {
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
    const ApiKeyModel = getApiKeyModel(mode);

    const apiKeyData = await ApiKeyModel.find({ m_id: merchantId });

    if (apiKeyData.length === 0) {
      return res.status(404).json({ status: false, error: "No records found" });
    }

    return res.status(200).json({
      status: true,
      data: apiKeyData,
      message: "Fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({ status:false, error: error.message });
  }
};
