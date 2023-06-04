const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getUser = async (req, res) => {
  let userId = req.user.id;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        chats: {
          select: {
            users: {
              select: {
                fullName: true,
                id: true,
              },
            },
            name: true,
            id: true,
            messages: {
              take: 1,
              orderBy: { timeStamp: "desc" },
              select: {
                id: true,
                content: true,
              },
            },
          },
        },
      },
    });
    res.json({ user });
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const createUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Check if required fields are present
    if (!fullName || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        fullName,

        email,
        password: hashedPassword,
      },
    });
    res.json({ message: user });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getUser,
  createUser,
};
