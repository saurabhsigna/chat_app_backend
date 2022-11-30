const express = require("express");
const authController = require("../controllers/GoogleAuthController");

const router = express.Router();

// Initiate Google authentication
router.get("/google", authController.googleAuth);

// Google OAuth2 callback
router.get(
  "/google/callback",
  authController.googleCallback,
  authController.googleCallbackHandler
);

module.exports = router;
