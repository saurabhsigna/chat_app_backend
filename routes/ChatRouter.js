const express = require("express");
const router = express.Router();
const passport = require("passport");
const ChatController = require("../controllers/ChatController");

// GET /users
router.get(
  "/getchat",
  passport.authenticate("jwt", { session: false }),
  ChatController.getChat
);

// POST /users
router.post(
  "/createchat",
  passport.authenticate("jwt", { session: false }),
  ChatController.createChat
);

module.exports = router;
