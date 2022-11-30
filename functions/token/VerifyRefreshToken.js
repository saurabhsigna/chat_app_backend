const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const verifyAsync = promisify(jwt.verify);

require("dotenv").config();
const verifyRefreshToken = async (token) => {
  try {
    const decoded = await verifyAsync(token, process.env.REFRESH_TOKEN_SECRET);
    return decoded;
  } catch (error) {
    throw new Error("Invalid refresh token");
  }
};
module.exports = {
  verifyRefreshToken,
};
