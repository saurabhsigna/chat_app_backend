const verifyRefreshToken = require("../functions/token/VerifyRefreshToken");
const signAccessToken = require("../functions/token/SignAccessToken");
const signRefreshToken = require("../functions/token/SignRefreshToken");
const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.body.hello;
    console.log(refreshToken);
    if (!refreshToken) {
      res.status(400).send("badRequest");
    }
    const userPayload = await verifyRefreshToken.verifyRefreshToken(
      refreshToken
    );

    const accessToken = await signAccessToken.signAccessToken(userPayload.id);
    const refToken = await signRefreshToken.signRefreshToken(userPayload.id);
    res.send({ accessToken: accessToken, refreshToken: refToken });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  refreshToken,
};
