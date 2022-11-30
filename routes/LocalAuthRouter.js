const express = require("express");
const router = express.Router();

const LocalAuthController = require("../controllers/LocalAuthController");

// GET /users
router.post("/login", LocalAuthController.loginController);

// POST /users
router.post("/register", LocalAuthController.registerController);

module.exports = router;
