const { z } = require("zod");

// Regex pattern to match valid IPv4 and IPv6 addresses
const ipSchema = z.string().refine(
  (val) => {
    const ipRegex =
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipRegex.test(val);
  },
  {
    message: "Invalid IP address",
  }
);

const CreateWhiteListSchema = z.object({
  ip_address: ipSchema,
});
module.exports = CreateWhiteListSchema;
