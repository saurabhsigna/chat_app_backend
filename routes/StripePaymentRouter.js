const express = require("express");
const router = express.Router();
const passport = require("passport");
const stripePaymentController = require("../controllers/payment/StripeController");
const stripePaymentController2 = require("../controllers/payment/StripeController2");
const checkStockAvailable = require("../controllers/purchase/middlewares/CheckStockAvailability");
const isItemValid = require("../controllers/purchase/middlewares/ItemsValidator");
// GET /users
router.get(
  "/make-event",
  passport.authenticate("jwt", { session: false }),
  stripePaymentController.makeEvent
);

// // POST / users;
// router.post(
//   "/stripe-checkout",
//   passport.authenticate("jwt", { session: false }),
//   stripePaymentController.stripePayment
// );

router.post(
  "/stripe-checkout",
  passport.authenticate("jwt", { session: false }),
  isItemValid,
  checkStockAvailable,
  stripePaymentController2.stripePayment
);
module.exports = router;
