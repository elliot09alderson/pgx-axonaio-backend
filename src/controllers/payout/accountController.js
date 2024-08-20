const accountModel = require("../../models/payout/account");



// FUNCTION FOR GENERATE UNIQUE ID
function generateUNIQUEId() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const minLength = 22;
  const maxLength = 24;
  const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
  let uniqueId = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    uniqueId += characters.charAt(randomIndex);
  }

  return uniqueId;
}
const createaccount = async (req, res) => {
  try {
    const merchantId = req.user.m_id

    const { bank_name, account_holder_name,account_number,ifsc_code,vendor_id } = req.body;

    // Validate request body
    if (!bank_name || !account_holder_name || !account_number || !ifsc_code || !vendor_id) {
      return res.status(400).json({ status:false, error: "all fields is required " });
    }

    // Create a new account
    const account = await accountModel.create({
      account_id : generateUNIQUEId(),
      bank_name, account_holder_name,account_number,ifsc_code,vendor_id,
            m_id: merchantId,
    });

    res
      .status(201)
      .json({ status:true, message: "created successfully", data: account });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const get_account = async (req, res) => {
  try {
    const merchantId = req.user.m_id;
    console.log(merchantId);
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

    const accountData = await accountModel.aggregate(pipeline);

    if (accountData.length === 0) {
      return res
        .status(404)
        .json({ status:false,
          error: "no records found", });
    }

    res.status(200).json({
      data: accountData[0].documents, // Return the 'documents' array containing all matched account data
      message: "fetched successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateaccount = async (req, res) => {
  try {
    // console.log(req.params);
    // console.log("body", req.body);

    const { id } = req.params;
    const { bank_name, } = req.body;
    // console.log(written_url);

    // Validate request body
    if (!bank_name) {
      return res.status(400).json({ status:false,
        error: "all required fields" });
    }

    // Find the account by ID and update it
    const account = await accountModel.findOneAndUpdate(
      {  account_id : id },
      { bank_name },
      { new: true }
    );
    // console.log(account);

    if (!account) {
      return res.status(404).json({ status: false, error: "no records found" });
    }

    res
      .status(200)
      .json({ status:true, message: "account updated successfully", data: account });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteaccount = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the account by ID and delete it
    const account = await accountModel.findOneAndDelete({ account_id  : id });
    // console.log("deleted ip ", account);
    if (!account) {
      return res.status(404).json({  status: false, error: "no records found" });
    }

    res.status(304).json({ status:true,message: "deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createaccount, get_account, updateaccount, deleteaccount };
