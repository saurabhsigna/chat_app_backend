const express = require("express");
const router = express.Router();
const passport = require("passport");
const purchaseController = require("../controllers/purchase/PurchaseController");

// GET /users
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  purchaseController.getPurchasedItem
);

// POST / users;
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  purchaseController.purchaseItem
);

module.exports = router;
