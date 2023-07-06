const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const dotenv = require("dotenv");
dotenv.config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const getProductById = async (id) => {
  try {
    const storeItem = await prisma.product.findUnique({
      where: { id },
    });
    return storeItem;
  } catch (error) {
    throw new Error(`Error in getStoreItemById: ${error.message}`);
  }
};

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
    let { items } = req.body;
    let userId = req.user.id;

    if (!Array.isArray(items)) {
      throw new Error("Invalid items format. Expected an array.");
    }

    const validItems = items.every(
      (item) =>
        item &&
        typeof item.pid === "string" &&
        typeof item.quantity === "number"
    );

    if (!validItems) {
      throw new Error(
        "Invalid items format. Each item should have 'pid' and 'quantity' properties."
      );
    }

    const lineItemsPromises = items.map((item) =>
      getProductById(item.pid).then((storeItem) => {
        return {
          price_data: {
            currency: "inr",
            product_data: {
              name: storeItem.name,
              images: [storeItem.imgUri],
            },
            unit_amount: storeItem.price * 100,
          },
          quantity: item.quantity,
        };
      })
    );

    const lineItems = await Promise.all(lineItemsPromises);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      shipping_options: shippingOptions,
      line_items: lineItems,
      success_url: `https://n2tcty-3000.csb.app/testing/orders/success`,
      cancel_url: `https://n2tcty-3000.csb.app/testing/orders/list`,
    });

    // await prisma.payments.create({
    //   data: {
    //     checkout_id: session.id,
    //     status: "PENDING",
    //     items: items,
    //     user_id: userId,
    //   },
    // });
    res.json({ message: session.url });
  } catch (error) {
    console.error("Error in payment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const makeEvent = async (req, res) => {
  try {
    stripe.webhookEndpoints.create({
      url: "https://seal-app-womin.ondigitalocean.app/webhook",
      enabled_events: ["payment_intent.succeeded"],
    });
    res.json({ message: "sent" });
  } catch (err) {
    console.error("Error in payment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
module.exports = {
  stripePayment,
  makeEvent,
};
