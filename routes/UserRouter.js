const express = require("express");
const router = express.Router();
const passport = require("passport");
const userController = require("../controllers/UserController");

// GET /users
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  userController.getUser
);

// POST /users
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  userController.createUser
);

module.exports = router;
