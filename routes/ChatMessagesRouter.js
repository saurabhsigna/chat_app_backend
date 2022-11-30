const express = require("express");
const router = express.Router();
const passport = require("passport");
const ChatMessagesController = require("../controllers/ChatMessagesController");

// GET /users
// router.get(
//   "/getchat",
//   passport.authenticate("jwt", { session: false }),
//   ChatMessagesController.getChat
// );

// POST /users
router.post(
  "/createchatmessage",
  passport.authenticate("jwt", { session: false }),
  ChatMessagesController.createChatMessage
);

module.exports = router;
