const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const fetchCart = async (req, res) => {
  const express = require("express");
  const { PrismaClient } = require("@prisma/client");

  const prisma = new PrismaClient();
  const app = express();

  app.use(express.json());

  // POST route for /cart
  app.post("/cart", async (req, res) => {
    const cartItems = req.body; // Assuming req.body is an array of cart items

    // Extracting the product IDs from the cart items
    const productIds = cartItems.map((item) => item.pid);

    try {
      // Fetching the products based on the product IDs
      const products = await prisma.product.findMany({
        where: {
          id: {
            in: productIds,
          },
        },
      });

      // Constructing the response
      const response = cartItems.map((item, index) => {
        const product = products.find((product) => product.id === item.pid);

        if (!product) {
          return { error: `Product with ID ${item.pid} not found` };
        }

        return {
          product: product,
          quantity: item.quantity,
        };
      });

      res.json(response);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Start the server
  app.listen(3000, () => {
    console.log("Server started on port 3000");
  });
};

module.exports = { fetchCart };
