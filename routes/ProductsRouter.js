const express = require("express");
const router = express.Router();
const passport = require("passport");
const ProductsController = require("../controllers/products/ProductsController");

// GET /users
router.post("/fetchproducts", ProductsController.getProducts);
router.post("/correctproducts", ProductsController.correct);
// POST /users

module.exports = router;
