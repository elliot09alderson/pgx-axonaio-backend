const LiveTransactionModel = require('../models/liveTransaction');

// Creating
exports.createLiveTransaction = async (req, res) => {
  try {
    const {
        transaction_gid,
        vendor_transaction_id,
        vendor_id,
        bank_ref_no,
        order_id,
        transaction_response,
        transaction_method_id,
        transaction_type,
        transaction_username,
        transaction_email,
        transaction_contact,
        transaction_amount,
        transaction_status,
        transaction_mode,
        transaction_notes,
        transaction_description,
        axonaio_tax,
        goods_service_tax,
        adjustment_done,
        transaction_date,
        transaction_ip,
        udf1,
        udf2,
        udf3,
        udf4,
        udf5,
        user_id
      } = req.body;
  

    // Validate request body
    if (!transaction_gid || !transaction_method_id || !transaction_amount || !user_id || !order_id || !transaction_date) {
        return res.status(400).json({ error: "All required fields must be provided" });
      }
      
    
    // Create new case
    const transactionCreation = await LiveTransactionModel.create({
        transaction_gid,
        vendor_transaction_id,
        vendor_id,
        bank_ref_no,
        order_id,
        transaction_response,
        transaction_method_id,
        transaction_type,
        transaction_username,
        transaction_email,
        transaction_contact,
        transaction_amount,
        transaction_status,
        transaction_mode,
        transaction_notes,
        transaction_description,
        axonaio_tax,
        goods_service_tax,
        adjustment_done,
        transaction_date,
        transaction_ip,
        udf1,
        udf2,
        udf3,
        udf4,
        udf5,
      user_id: req.user._id 
    });

    res.status(201).json({ message: 'transaction created successfully', data: transactionCreation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get all transaction

exports.getAllLiveTransaction = async (req, res) => {
    try {
      const liveTransaction = await LiveTransactionModel.findone({ user_id: req.user._id });
      if (liveTransaction) {
        res.status(200).json(liveTransaction)
      } else {
        res.status(401).json({ message: 'livetransaction details is not found!' })
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
  

