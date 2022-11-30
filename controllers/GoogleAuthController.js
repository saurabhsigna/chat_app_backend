const passport = require("passport");

// Initiate Google authentication
const googleAuth = passport.authenticate("google", {
  session: false,
  scope: ["profile", "email"],
});

// Google OAuth2 callback
const googleCallback = passport.authenticate("google", {
  session: false,
  failureRedirect: "/login",
});

// Redirect or respond with data after successful authentication
const googleCallbackHandler = (req, res) => {
  console.log(req.user.token);
  res.redirect("/profile");
};

module.exports = {
  googleAuth,
  googleCallback,
  googleCallbackHandler,
};
