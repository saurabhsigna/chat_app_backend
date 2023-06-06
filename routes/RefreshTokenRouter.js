const express = require("express");
const router = express.Router();

const refreshTokenController = require("../controllers/RefreshTokenController");

// POST /users
router.post("/refreshtoken", refreshTokenController.refreshToken);
module.exports = router;
