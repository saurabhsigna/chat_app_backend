const express = require("express");
const router = express.Router();
const passport = require("passport");
const stripePaymentController = require("../controllers/payment/StripeController");

// GET /users
router.get(
  "/make-event",
  passport.authenticate("jwt", { session: false }),
  stripePaymentController.makeEvent
);

// POST / users;
router.post(
  "/stripe-checkout",
  passport.authenticate("jwt", { session: false }),
  stripePaymentController.stripePayment
);

module.exports = router;
