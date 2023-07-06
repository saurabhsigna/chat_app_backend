
const checkStockAvailability = async (req, res, next) => {
  const productIds = req.items.map((item) => item.pid);

  const products = await prisma.product.findMany({
    where: {
      id: { in: productIds },
    },
  });

  const productsMap = {};
  for (const product of products) {
    productsMap[product.id] = product;
  }

  for (const item of req.items) {
    const productId = item.pid;
    const quantity = item.quantity;

    if (!productId || !quantity) {
      console.log("Item is not fairly configured");
      return res.status(400).json({ error: "Item is not fairly configured" });
    }

    const product = productsMap[productId];
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const productQuantity = product.stock;
    if (productQuantity < quantity) {
      return res
        .status(400)
        .json({ error: "Not much left, try a lower quantity for some items" });
    }
  }

  req.productsMap = productsMap;
  next();
};
