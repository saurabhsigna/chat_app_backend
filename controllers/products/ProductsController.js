const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getProducts = async (req, res) => {
  try {
    const { bookCategory } = req.body;

    // Check if bookCategory is provided
    if (!bookCategory) {
      return res
        .status(400)
        .json({ error: "Bad request. bookCategory is missing." });
    }

    const relatedProducts = await prisma.product.findMany({
      where: {
        category: {
          contains: bookCategory,
        },
      },
      select: {
        id: true,
        category: true,
        stock: true,
        imgUri: true,
        price: true,
        name: true,
        createdAt: true,
        label: true,
      },
    });

    // Check if any products were found
    if (relatedProducts.length === 0) {
      return res
        .status(404)
        .json({ error: "No products found for the given category." });
    }

    // Return the relatedProducts
    return res.json(relatedProducts);
  } catch (err) {
    // Handle any other unexpected errors
    console.error(err);
    return res.status(500).json({ error: "Internal server error." });
  }
};

const correct = async (req, res) => {
  try {
    await updateImgUriColumn();

    res.status(200).json({ message: "imgUri column successfully updated." });
  } catch (error) {
    console.error("Error updating imgUri column:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

async function updateImgUriColumn() {
  try {
    const products = await prisma.product.findMany();

    // Start a Prisma transaction
    await prisma.$transaction(async (prisma) => {
      const updateOperations = products.map((product) => {
        let imgUri = product.imgUri;

        if (!Array.isArray(imgUri)) {
          console.log("parivartanam");

          imgUri = [imgUri];
        }

        return prisma.product.update({
          where: { id: product.id },
          data: { imgUri },
        });
      });

      await Promise.all(updateOperations);
    });

    console.log("imgUri column successfully updated.");
  } catch (error) {
    console.error("Error updating imgUri column:", error);
  } finally {
    await prisma.$disconnect();
  }
}

module.exports = {
  getProducts,
  correct,
};
