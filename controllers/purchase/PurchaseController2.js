

const purchaseItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const productsMap = req.productsMap;

    // Purchase all items
    for (const item of req.items) {
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

      const buyer = await prisma.user.findUnique({
        where: { id: userId },
        select: { fullName: true, mobileNumber: true },
      });

      if (buyer.mobileNumber) {
        client.messages
          .create({
            body: `Thanks for buying '${buyer.fullName}' from "All For Us", you can check our website: https://freeschooool.com`,
            mediaUrl:
              "https://freeschooool.sgp1.cdn.digitaloceanspaces.com/white_chinese-min.png",
            from: "whatsapp:+14155238886",
            to: "whatsapp:+918423376954",
          })
          .then((message) => console.log(message))
          .catch((error) => console.error(error));
      }
    }

    res.json({ message: "Items processed successfully" });
  } catch (err) {
    console.error("Error in purchaseItem:", err);
    res.status(500).json({ error: err.message });
  }
};

// Apply middleware functions
app.post("/purchase", checkItemsArray, checkStockAvailability, purchaseItem);
