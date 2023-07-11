const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const dotenv = require("dotenv");
dotenv.config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const shippingOptions = [
  {
    shipping_rate_data: {
      type: "fixed_amount",
      fixed_amount: {
        amount: 15 * 100,
        currency: "inr",
      },
      display_name: "Ultra Fast Delivery",
      delivery_estimate: {
        minimum: {
          unit: "hour",
          value: 2,
        },
        maximum: {
          unit: "hour",
          value: 5,
        },
      },
    },
  },
];
const stripePayment = async (req, res) => {
  try {
    let items = req.items;
    const productsMap = req.productsMap;
    let userId = req.user.id;

    const lineItemsPromises = items.map((item) => {
      let storeItem = productsMap[item.pid];
      return {
        price_data: {
          currency: "inr",
          product_data: {
            name: storeItem.name,
            images: [storeItem.imgUri[0]],
          },
          unit_amount: storeItem.price * 100,
        },
        quantity: item.quantity,
      };
    });

    const lineItems = await Promise.all(lineItemsPromises);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      shipping_options: shippingOptions,
      line_items: lineItems,
      success_url: `https://n2tcty-3000.csb.app/testing/orders/success`,
      cancel_url: `https://n2tcty-3000.csb.app/testing/orders/list`,
    });

    await prisma.payments.create({
      data: {
        checkout_id: session.id,
        status: "PENDING",
        items: items,
        user_id: userId,
      },
    });

    res.json({ message: session.url });
  } catch (error) {
    console.error("Error in payment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { stripePayment };
