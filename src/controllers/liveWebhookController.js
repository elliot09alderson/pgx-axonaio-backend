const LiveWebhook = require('../models/liveWebhook');

// Creating
exports.createLiveWebhook = async (req, res) => {
  try {
    const { webhook_url, secret_key, user_id } = req.body;

    // Validate request body
    if (!webhook_url || !secret_key || !user_id ) {
      return res.status(400).json({ error: "All required fields must be provided" });
    }

    // Create new case
    const webhook = await LiveWebhook.create({
        secret_key,
        webhook_url,
        user_id: req.user._id 
    });

    res.status(201).json({ message: 'Webhook created successfully', data: webhook });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get all livecases
exports.getAllWebhook = async (req, res) => {
    try {
      const webhooks = await LiveWebhook.findone({ user_id: req.user._id });
      if (webhooks) {
        res.status(200).json(webhooks)
      } else {
        res.status(401).json({ message: 'webhooks details is not found!' })
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  exports.updateWehook = async  (req, res) => {
    try {
        const { webhook_url, secret_key, user_id } = req.body;


        const WebhookDatatwo = {
            secret_key,
        webhook_url,
        user_id: req.user._id 
      };
      const webhookDetails = await LiveWebhook.updateOne({ user_id: req.user._id }, WebhookDatatwo, { upsert: true })
      if (webhookDetails) {
        return res.status(200).send({
          message: "webhook details updated successfully!",
          result: true,
        })
      } else {
        res.status(401).json({ messaage: 'Details is still not updated!' })
      }
    } catch (err) {
      return res.status(500).send({ message: err.message, result: false });
    }
  }
  

