const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createChat = async (req, res) => {
  let { receiverId } = req.body;
  let senderId = req.user.id;
 
  const newChat = await prisma.chat.create({
    data: {
      name: "billboard",
      users: {
        connect: [{ id: senderId }, { id: receiverId }],
      },
    },
  });
  res.json({ message: newChat });
};

const getChat = async (req, res) => {
  const { chatId } = req.body;
  const userId = req.user.id;

  try {
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      select: {
        users: {
          select: {
            id: true,
            fullName: true,
            imgUri: true,
          },
        },
        messages: {
          select: {
            id: true,
            senderId: true,
            chatId: true,
            content: true,
            timeStamp: true,
          },
        },
      },
    });

    if (!chat) {
      throw new Error("Chat not found");
    }

    const userInChat = chat.users.find((user) => user.id === userId);

    if (!userInChat) {
      throw new Error("You are not a member of this chat");
    }

    res.json(chat);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createChat,
  getChat,
};
