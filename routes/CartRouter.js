const express = require("express");
const router = express.Router();
const passport = require("passport");
const CartController = require("../controllers/cart/FetchCartController");

// GET /users
router.post("/fetchcart", CartController.fetchCart);

// POST /users

module.exports = router;
