const request = require("supertest");
const express = require("express");
const passport = require("passport");
const ChatController = require("../ChatController");
const { PrismaClient } = require("@prisma/client");

// Create an instance of Express server
const app = express();

app.use(express.json());

app.use(express.urlencoded({extended:true}))

// Mock the Passport middleware
jest.mock("passport", () => ({
  authenticate: jest.fn().mockReturnValue((req, res, next) => {
    req.user = { id: "mockUserId" }; // Provide a mock user object for testing
    next();
  }),
}));




// Mock the Prisma client methods
jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    chat: {
      create: jest.fn().mockResolvedValue({ id: "mockChatId" }),
      findUnique: jest.fn().mockResolvedValue({
        id: "mockChatId",
        users: [
                    { id: "mockReceiverId", fullName: "John Doe", imgUri: "mockImgUri" },

          { id: "mockUserId", fullName: "John Doe", imgUri: "mockImgUri" },
        ],
        messages: [
          {
            id: "mockMessageId",
            senderId: "mockUserId",
            chatId: "mockChatId",
            content: "Mock message content",
            timeStamp: new Date(),
          },
        ],
      }),
    },
  })),
}));

// Set up the routes
app.get("/getchat", passport.authenticate("jwt", { session: false }), ChatController.getChat);
app.post("/createchat", passport.authenticate("jwt", { session: false }), ChatController.createChat);

describe("ChatController", () => {
  test("GET /getchat should return chat object if chatId is valid and user is a member", async () => {
    const chatId = "mockChatId";
    const userId = "mockUserId";

    const res = await request(app)
      .get("/getchat")
      .set("Authorization", "Bearer mockToken")
      .send({ chatId })
      .expect(200);

    expect(res.body.id).toBe(chatId);
    expect(res.body.users.some((user) => user.id === userId)).toBe(true);
  });

  test("GET /getchat should return 400 if chatId is missing", async () => {
    const res = await request(app)
      .get("/getchat")
      .set("Authorization", "Bearer mockToken")
      .expect(400);

    expect(res.body.error).toBe("Chat ID is required");
  });

  test("POST /createchat should create a new chat and return the chat object", async () => {
    const receiverId = "mockReceiverId";
    const senderId = "mockUserId";

    const res = await request(app)
      .post("/createchat")
      .set("Authorization", "Bearer mockToken")
      .send({receiverId })
       .expect(200)
       
// expect(res.status).toBe(200);

    // expect(res.body.message.name).toBe("billboard");
    // expect(res.body.message.users.some((user) => user.id === senderId)).toBe(true);
    // expect(res.body.message.users.some((user) => user.id === receiverId)).toBe(true);
  });

  test("POST /createchat should return 400 if receiverId is missing", async () => {
    const res = await request(app)
      .post("/createchat")
      .set("Authorization", "Bearer mockToken")
      .expect(400);

    // expect(res.body.error).toBe("Receiver ID is required");
  });
});
