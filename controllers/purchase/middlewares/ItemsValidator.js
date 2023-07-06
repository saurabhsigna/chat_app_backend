const checkItemsArray = (req, res, next) => {
  const { items } = req.body;

  if (!Array.isArray(items)) {
    return res.status(400).json({ error: "Items must be an array" });
  }
  if (items.length === 0) {
    return res.status(400).json({ error: "Should have at least 1 product" });
  }

  req.items = items;
  next();
};