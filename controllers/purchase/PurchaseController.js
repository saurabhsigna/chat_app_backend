const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
require("dotenv").config();
const client = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const getPurchasedItem = async (req, res) => {
  try {
    let { productId, quantity } = req.body;
    let userId = req.user.id;

    const purchases = await prisma.purchase.findMany({
      where: { userId },
    });

    res.json({ purchases });
  } catch (error) {
    console.error("Error in purchaseItem:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const purchaseItem = async (req, res) => {
  try {
    const { items } = req.body;
    let userId = req.user.id;

    if (!Array.isArray(items)) {
      throw new Error("Items must be an array");
    }
    if (items.length === 0) {
      throw new Error("Should have at least 1 product");
    }

    for (const item of items) {
      const productId = item.pid;
      const quantity = item.quantity;

      if (!productId || !quantity) {
        console.log("Item is not fairly configured");
        throw new Error("Item is not fairly configured");
      } else {
        console.log("Nothing happened, chill!");

        const product = await prisma.product.findUnique({
          where: { id: productId },
        });

        if (!product) {
          throw new Error("productNotFound");
        } else {
          const ProductQuantity = product.stock;
          console.log(quantity);
          if (ProductQuantity < quantity) {
            throw new Error("notmuchleft");
          } else {
            await prisma.purchase.create({
              data: {
                description: product.description,
                title: product.name,
                image: product.imgUri,
                price: product.price,
                quantity: quantity,
                productId,
                userId,
              },
            });
            await prisma.product.update({
              where: {
                id: productId,
              },
              data: {
                stock: ProductQuantity - quantity,
              },
            });

            const buyer = await prisma.user.findUnique({
              where: { id: userId },
              select: { fullName: true, mobileNumber: true },
            });

            if (buyer.mobileNumber) {
              client.messages
                .create({
                  body: `Thanks for buying '${buyer.fullName}' from "All For Us", you can check our website : https://freeschooool.com`, // Message content
                  mediaUrl:
                    "https://freeschooool.sgp1.cdn.digitaloceanspaces.com/white_chinese-min.png",
                  from: "whatsapp:+14155238886",
                  to: "whatsapp:+918423376954",
                })
                .then((message) => console.log(message))
                .catch((error) => console.error(error));
            }
          }
        }
      }
    }

    res.json({ message: "Items processed successfully" });
  } catch (err) {
    console.error("Error in purchaseItem:", err);

    if (err.message === "productNotFound") {
      res.status(404).json({ error: "Product not found" });
    } else if (err.message == "notmuchleft") {
      res.status(400).json({ error: "not much left , try some less quantity" });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = { getPurchasedItem, purchaseItem };
