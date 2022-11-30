const jwt = require("jsonwebtoken")
const { promisify } = require('util');
const signAsync = promisify(jwt.sign);
require("dotenv").config();

const signRefreshToken =async (userId)=>{
      try {
     const payload = {
    userId
    // You can include any additional claims here as well
  };
  const options = {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRESIN  // Set the desired expiration time
  };
  const token = await signAsync(payload, process.env.JWT_SECRET, options);
  return token;
  } catch (error) {
    throw new Error('Invalid access token');
  }
}
module.exports = {
    signRefreshToken
}