const LiveCasesModel = require('../models/liveCases');

// Creating
exports.createLiveCases = async (req, res) => {
  try {
    const { case_git, transaction_gid, case_amount, case_notes, case_status, user_id } = req.body;

    // Validate request body
    if (!case_git || !transaction_gid || !case_amount || !case_status || !user_id) {
      return res.status(400).json({ error: "All required fields must be provided" });
    }

    // Create new case
    const newCase = await LiveCasesModel.create({
      case_git,
      transaction_gid,
      case_amount,
      case_notes,
      case_status,
      user_id: req.user._id 
    });

    res.status(201).json({ message: 'Case created successfully', data: newCase });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get all livecases
exports.getAllLiveCases = async (req, res) => {
    try {
      const liveCases = await LiveCasesModel.findone({ user_id: req.user._id });
      if (liveCases) {
        res.status(200).json(liveCases)
      } else {
        res.status(401).json({ message: 'livecases details is not found!' })
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  exports.updateLivecases = async  (req, res) => {
    try {
        const { case_git, transaction_gid, case_amount, case_notes, case_status, user_id } = req.body;
        const liveCasesDatatwo = {
            case_git,
            transaction_gid,
            case_amount,
            case_notes,
            case_status,
            user_id: req.user._id 
      };
      const liveCasesDetails = await LiveCasesModel.updateOne({ user_id: req.user._id }, liveCasesDatatwo, { upsert: true })
      if (liveCasesDetails) {
        return res.status(200).send({
          message: "liveCases details updated successfully!",
          result: true,
        })
      } else {
        res.status(401).json({ messaage: 'Details is still not updated!' })
      }
    } catch (err) {
      return res.status(500).send({ message: err.message, result: false });
    }
  }
  

