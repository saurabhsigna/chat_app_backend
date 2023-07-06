const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
require("dotenv").config();

const Success = async (checkoutId) => {
  try {
    let paymentCheckque = await prisma.payments.findUnique({
      where: {
        checkout_id: checkoutId,
      },
    });

    const items = paymentCheckque.items;
    const userId = paymentCheckque.user_id;

    const productIds = items.map((item) => item.pid);

    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
      },
    });
    const productsMap = {};
    for (const product of products) {
      productsMap[product.id] = product;
    }

    for (const item of items) {
      const productId = item.pid;
      const quantity = item.quantity;
      const product = productsMap[productId];
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
          stock: product.stock - quantity,
        },
      });
    }
  } catch (error) {
    throw new Error(
      "error is in webhook ke success field me : ",
      error.message
    );
  }
};
module.exports = {
  Success,
};
