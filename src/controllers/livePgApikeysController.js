const LiveApiModel = require('../models/livePgApikeys');

// Creating
exports.createPgApikeys = async (req, res) => {
  try {
    const { api_key, api_secret, user_id } = req.body;

    // Validate request body
    if (!api_key || !api_secret || !user_id ) {
      return res.status(400).json({ error: "All required fields must be provided" });
    }
        // Generate API keys
        const apiKey = generateApiKey();
        const apiSecret = generateApiKey();
        const requestHashKey = generateApiKey();
        const responseHashKey = generateApiKey();
        const requestSaltKey = generateApiKey();
        const responseSaltKey = generateApiKey();
        const encryptionRequestKey = generateApiKey();
        const encryptionResponseKey = generateApiKey();
  

        // Create a new API keys document
        const liveApi = await LiveApiModel.create({
        api_key: apiKey,
        api_secret: apiSecret,
        request_hashkey: requestHashKey,
        response_hashkey: responseHashKey,
        request_salt_key: requestSaltKey,
        response_salt_key: responseSaltKey,
        encryption_request_key: encryptionRequestKey,
        encryption_response_key: encryptionResponseKey,
        user_id: req.user.id // 
    });

    res.status(201).json({ message: 'apiKeys created successfully', data: liveApi });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Helper function to generate API keys
function generateApiKey() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = 32; // Length of the API key
    let apiKey = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      apiKey += characters.charAt(randomIndex);
    }
  
    return apiKey;
  }
  

// Get all livecases
exports.getAllApiKeys = async (req, res) => {
    try {
      const ApiKeys = await LiveApiModel.findone({ user_id: req.user._id });
      if (ApiKeys) {
        res.status(200).json(ApiKeys)
      } else {
        res.status(401).json({ message: 'ApiKeys details is not found!' })
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }


  

