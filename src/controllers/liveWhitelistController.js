const LiveWhiteList = require('../models/liveWhitelist');

// Creating
exports.createLiveWhitelist = async (req, res) => {
    try {
      const { ip_name, ip_address, user_id } = req.body;
  
      // Validate request body
      if (!ip_address || !ip_name || !user_id) {
        return res.status(400).json({ error: "All required fields must be provided" });
      }
  
      // Check how many whitelist entries the user already has
      const existingWhitelistCount = await LiveWhiteList.countDocuments({ user_id: req.user._id });
        
      // Check if the user has already reached the maximum limit of 5 whitelist entries
      if (existingWhitelistCount >= 5) {
        return res.status(400).json({ error: "You have reached the maximum limit of 5 IP addresses in the whitelist" });
      }
  
      // Create new whitelist entry
      const whitelist = await LiveWhiteList.create({
        ip_name,
        ip_address,
        ip_addr_count: existingWhitelistCount + 1,
        user_id
      });
  
      res.status(201).json({ message: 'Whitelist created successfully', data: whitelist });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  

// Get all livecases
exports.getAllWhitelist = async (req, res) => {
    try {
      const whitelist = await LiveWhiteList.findone({ user_id: req.user._id });
      if (whitelist) {
        return res.status(200).json(whitelist)
      } else {
        return res.status(401).json({ message: 'whitelist details is not found!' })
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
// Update the details
exports.updateWhitelist = async  (req, res) => {
    try {
        const { ip_name, ip_address } = req.body;


        const WhitelistDatatwo = {
            ip_name,
            ip_address,
      };
      const whiteListDetails = await LiveWhiteList.updateOne({ user_id: req.user._id }, WhitelistDatatwo, { upsert: true })
      if (whiteListDetails) {
        return res.status(200).json({
          message: "whiteListDetails  updated successfully!",
          result: true,
        })
      } else {
        res.status(401).json({ messaage: 'Details is still not updated!' })
      }
    } catch (err) {
      return res.status(500).send({ message: err.message, result: false });
    }
  }
  // Deleting the IPs
exports.deleteLiveWhitelist = async (req, res) => {
    try {
      const { whitelistId } = req.params;
      
      // Find the whitelist entry to be deleted
      const whitelistEntry = await LiveWhiteList.findById(whitelistId);
  
      // Check if the whitelist entry exists
      if (!whitelistEntry) {
        return res.status(404).json({ error: "Whitelist entry not found" });
      }
  
      // Check if the whitelist entry belongs to the current user
      if (whitelistEntry.user_id !== req.user._id) {
        return res.status(403).json({ error: "You are not authorized to delete this whitelist entry" });
      }
  
      // Delete the whitelist entry
      await whitelistEntry.remove();
  
      // Recalculate the count of remaining whitelist entries associated with the user
      const remainingWhitelistCount = await LiveWhiteList.countDocuments({ user_id: req.user._id });
  
      res.json({ message: 'Whitelist entry deleted successfully', remainingWhitelistCount });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  

