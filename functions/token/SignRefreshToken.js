const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const signAsync = promisify(jwt.sign);
require("dotenv").config();

const signRefreshToken = async (userId) => {
  try {
    const payload = {
      userId,
      // You can include any additional claims here as well
    };
    const options = {
      expiresIn: "30d", // Set the desired expiration time
    };
    const token = await signAsync(
      payload,
      process.env.REFRESH_TOKEN_SECRET,
      options
    );
    return token;
  } catch (error) {
    throw new Error("Invalid refresh token");
  }
};
module.exports = {
  signRefreshToken,
};
