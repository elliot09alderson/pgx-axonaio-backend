const jwt = require("jsonwebtoken");
const User = require("../models/user");

const onboardMerchant = async (req, res, next) => {
  const {
    name,
    password,
    email,
    phonenumber,
    confirmpassword,
    companyName,
    businessType,
    businessCategory,
    description,
    website,
    city,
    state,
    address,
    pincode,
    agree,
    panNumber,
    aadharVoterIdPassportDLNumber,
    gstNumber,
    cancelledCheque,
    companyPan,
    registrationCertificate,
  } = req.body;

  // Access files
  const panAttachment = req.files["panAttachment"]
    ? req.files["panAttachment"][0]
    : null;
  const cancelledChequeAttachment = req.files["cancelledChequeAttachment"]
    ? req.files["cancelledChequeAttachment"][0]
    : null;
  const aadharVoterIdPassportAttachment = req.files[
    "aadharVoterIdPassportAttachment"
  ]
    ? req.files["aadharVoterIdPassportAttachment"][0]
    : null;

  // create user using 4 fields
  // create busiinessDetails
  // create DocumentDetails
  // Document {path, filename}
  // generate m_id

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return next();
  }

  console.log(
    panAttachment,
    cancelledChequeAttachment,
    aadharVoterIdPassportAttachment
  );

  // Save to the database
  await newMerchant.save();

  res
    .status(201)
    .json({ message: "Merchant created successfully", newMerchant });

  try {
    const payload = jwt.verify(token, secretKey);
    const { role, _id } = payload;

    if (role === "reseller") {
      const reseller = await User.findOne({ r_id: _id });
      await reseller.resellers_merchant.push(user.m_id);

      // Attach reseller to request object if needed
    } else if (role === "reseller_admin") {
      const resellerAdmin = await User.findOne({ ra_id: _id });

      // Attach reseller admin to request object if needed
      req.resellerAdmin = resellerAdmin;
    } else {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
