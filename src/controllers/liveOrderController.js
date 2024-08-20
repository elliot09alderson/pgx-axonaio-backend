const LiveOrderModel = require('../models/liveOrder');

// Creating
exports.createLiveTransaction = async (req, res) => {
  try {
    const {
        order_gid,
        order_amount,
        order_attempts,
        order_receipt,
        order_status,
        user_id
      } = req.body;
  
    // Validate request body
    if (!order_amount   || !user_id || !order_gid ) {
        return res.status(400).json({ error: "All required fields must be provided" });
      }
      
    
    // Create new Order
    const liveOrder = await LiveOrderModel.create({
        order_gid,
        order_amount,
        order_attempts,
        order_receipt,
        order_status,
      user_id: req.user._id 
    });

    res.status(201).json({ message: 'transaction created successfully', data: liveOrder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get all OrderDetails
exports.getAllLiveOrder = async (req, res) => {
    try {
      const liveOrder = await LiveOrderModel.findone({ user_id: req.user._id });
      if (liveOrder) {
        res.status(200).json(liveOrder)
      } else {
        res.status(401).json({ message: 'liveOrder details is not found!' })
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

//   exports.updateLivecases = async  (req, res) => {
//     try {
//         const { case_git, transaction_gid, case_amount, case_notes, case_status, user_id } = req.body;
//         const liveCasesDatatwo = {
//             case_git,
//             transaction_gid,
//             case_amount,
//             case_notes,
//             case_status,
//             user_id: req.user._id 
//       };
//       const liveCasesDetails = await LiveCasesModel.updateOne({ user_id: req.user._id }, liveCasesDatatwo, { upsert: true })
//       if (liveCasesDetails) {
//         return res.status(200).send({
//           message: "liveCases details updated successfully!",
//           result: true,
//         })
//       } else {
//         res.status(401).json({ messaage: 'Details is still not updated!' })
//       }
//     } catch (err) {
//       return res.status(500).send({ message: err.message, result: false });
//     }
//   }
  

