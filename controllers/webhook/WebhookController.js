const Success = require("../../webhooks/checkoutSuccess/Success");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const WebhookController = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.WEBHOOK_SECRET
    );
  } catch (err) {
    // On error, log and return the error message
    console.log(`❌ Error message: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  switch (event.type) {
    case "checkout.session.completed":
      const checkoutSession = event.data.object;
      try {
        await Success(checkoutSession.id);
        console.log(
          "Success: Payment processed successfully for checkout session",
          checkoutSession.id
        );
      } catch (error) {
        console.log("Error occurred while processing payment:", error);
      }
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  // Successfully constructed event
  console.log("✅ Success:", event.id);

  // Return a response to acknowledge receipt of the event
  res.json({ received: true });
};

module.exports = { WebhookController };
