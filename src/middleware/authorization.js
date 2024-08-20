const jwt = require("jsonwebtoken");
const Token = require("../models/tokenSchema");
const User = require("../models/user");

// ******* Is Token  *******
const verifyUser = async (req, res, next) => {
  let authHeader = req.headers["authorization"];

  if (!authHeader)
    return res.status(401).json({ status: false, message: "Unauthorized" });

  authHeader = authHeader?.split(" ");
  const rawToken = authHeader[1];

  try {
    jwt.verify(rawToken, process.env.JWT_TOKEN_SECRET, async (err, user) => {
      if (err)
        return res.status(401).json({ status: false, message: "Unauthorized" });
      else {
        const userData = await User.findById(user._id.toString());
        req.user = userData;
        next();
      }
    });
  } catch (error) {
    console.log("error -> ", error);
    return res.status(401).json({ status: false, message: "Unauthorized" });
  }
};

// ******* Verify Token *******
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  // console.log("authHeader", req.headers);

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    const isValidToken = await Token.findOne({ token });

    if (!isValidToken)
      return res.status(401).json({ status: false, message: "Unauthorized" });

    try {
      jwt.verify(token, process.env.JWT_TOKEN_SECRET, async (err, user) => {
        if (err)
          return res
            .status(403)
            .json({ isAuth: false, message: "Token is not valid!." });
        // console.log(user)
        let userData = await User.findOne({
          $or: [{ m_id: user._id }, { r_id: user._id }, { ra_id: user._id }],
        });
        if (userData == null) {
          console.log("not found ");
          return res.status(401).json({ status: false, error: "who r you!" });
        }

        // const userData = await User.find({
        //   $or: [{ m_id: user._id }, { r_id: user._id }],
        // });

        // console.log("tokrn user", userData);
        req.user = userData;
        next();
      });
    } catch (error) {
      console.log(error.message);
      return res.status(401).json({ error: "Session Expired!." });
    }
  } else {
    return res.status(401).json({ error: "You are not authenticated!." });
  }
};

const verifyMerchantToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  // console.log("authHeader", req.headers);

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    const isValidToken = await Token.findOne({ token });

    if (!isValidToken)
      return res.status(401).json({ status: false, message: "Unauthorized" });

    try {
      jwt.verify(token, process.env.JWT_TOKEN_SECRET, async (err, user) => {
        if (err)
          return res
            .status(403)
            .json({ isAuth: false, message: "Token is not valid!." });

        let userData = await User.findOne({
          m_id: user._id,
          is_merchant: true,
        });
        if (userData == null) {
          console.log("not found ");
          return res.status(401).json({
            status: false,
            error: "not allowed to access this resource",
          });
        }

        req.user = userData;
        next();
      });
    } catch (error) {
      console.log(error.message);
      return res.status(401).json({ error: "Session Expired!." });
    }
  } else {
    return res.status(401).json({ error: "You are not authenticated!." });
  }
};

// ************Reseller Token**************

const verifyResellerToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  // console.log(authHeader);

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    // console.log(token);
    const isValidToken = await Token.findOne({ token });

    if (!isValidToken)
      return res.status(401).json({ isAuth: false, message: "Unauthorized" });
    jwt.verify(token, process.env.JWT_TOKEN_SECRET, async (err, user) => {
      if (err)
        return res
          .status(403)
          .json({ isAuth: false, message: "Token is not valid!." });
      // console.log(user)
      const userData = await User.findOne({ r_id: user._id });
      // console.log("tokrn user", userData, "-_________________-");
      req.user = userData;
      next();
    });
  } else {
    return res.status(401).json({ message: "You are not authenticated!." });
  }
};

// ************************ RESELLER ADMIN TOKEN*************************

const verifyResellerAdminToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    const isValidToken = await Token.findOne({ token });

    if (!isValidToken)
      return res.status(401).json({ isAuth: false, message: "Unauthorized" });
    jwt.verify(token, process.env.JWT_TOKEN_SECRET, async (err, user) => {
      if (err)
        return res
          .status(403)
          .json({ isAuth: false, message: "Token is not valid!." });

      const userData = await User.findOne({ ra_id: user._id });

      req.user = userData;
      next();
    });
  } else {
    return res.status(401).json({ message: "You are not authenticated!." });
  }
};
module.exports = {
  verifyUser,
  verifyToken,
  verifyResellerToken,
  verifyMerchantToken,
  verifyResellerAdminToken,
};
