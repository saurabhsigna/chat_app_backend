const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createChatMessage = async (req, res) => {
  const { chatId, content } = req.body;
  const senderId = req.user.id;

  const chat = await prisma.chat.findUnique({
    where: { id: chatId },
    select: {
      users: true,
    },
  });

  if (!chat) {
    return res.status(404).json({ error: "Chat not found" });
  }

  const userInChat = chat.users.find((user) => user.id === senderId);

  if (!userInChat) {
    return res.status(403).json({ error: "You are not a member of this chat" });
  }

  const newChatMessage = await prisma.message.create({
    data: {
      content,
      chatId,
      senderId,
    },
  });

  res.json({ message: newChatMessage });
};

const getChat = async (req, res) => {
  const { chatId } = req.body;
  const post = await prisma.chat.findUnique({
    where: { id: chatId },
  });

  if (!post) {
    throw new Error("Post not found");
  }

  // const author = await prisma.user.findUnique({
  //   where: { id: post.authorId },
  //   select: {
  //     fullName: true,
  //     // createdAt: true,
  //   },
  // });

  // return { ...post, author };

  // res.json({ ...post, author });
  res.json(post);
};
module.exports = {
  createChatMessage,
  getChat,
};
