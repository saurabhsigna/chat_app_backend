const express = require("express");
const router = express.Router();

const WebhookController = require("../controllers/webhook/WebhookController");

// POST /webhook
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  WebhookController.WebhookController
);

module.exports = router;
