const crypto = require("crypto");

const generateRandomLink = (length) => {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const randomBytes = crypto.randomBytes(length);
  const result = new Array(length);

  for (let i = 0; i < length; i++) {
    const index = randomBytes[i] % chars.length;
    result[i] = chars[index];
  }
  return result.join("");
};

const getRandomSevenDigitNumber = () => {
  return Math.floor(1000000 + Math.random() * 9000000);
};

module.exports = {
  generateRandomLink,
  getRandomSevenDigitNumber,
};
