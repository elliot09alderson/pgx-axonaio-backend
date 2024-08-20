const Token = require("../models/tokenSchema");
const User = require("../models/user");
const { decryptToken } = require("../utils/jwt_token");

const tokenVerify = async (req, res, next) => {
  try {
    const isValidToken = await Token.findOne({ token: req.query.token });
    if (!isValidToken)
      return res.status(401).json({ status: false, message: "Unauthorized" });
    const data = await decryptToken(req.query.token);
    if (data) {
      const user = await User.findById(data._id.toString());
      req.user = user;
      next();
    } else {
      return res.status(401).json({ status: false, message: "Unauthorized" });
    }
  } catch (error) {
    console.log("error -> ", error);
    return res.status(500).json({ status: false, message: "Unauthorized" });
  }
};

module.exports = {
  tokenVerify,
};
