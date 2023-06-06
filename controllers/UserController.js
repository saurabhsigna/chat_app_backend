const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const moment = require("moment")
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
        where:{
          id:{
            not:userId
          }
        },
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
                sender:{
                  select:{
                    fullName:true
                  }
                },
                timeStamp:true,
                id: true,
                content: true,
              },
            },
          },
        },
      },
    });
    
const convertRelativeTime = (rawDate)=>{
  const date = moment(rawDate); // Replace with your actual date
const relativeTime = date.fromNow();
return relativeTime
}

     const modifiedChats = user.chats.map(chat => {
      const modifiedMessages = chat.messages.map(message => ({
        fullName: message.sender.fullName,
        id: message.id,
        content: message.content,
        timeStamp: convertRelativeTime(message.timeStamp)
        
      }));

      return {
        ...chat,
        messages: modifiedMessages,
      };
    });

    // Update the chats property with the modified structure
    user.chats = modifiedChats;

    // res.json({ user });
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
