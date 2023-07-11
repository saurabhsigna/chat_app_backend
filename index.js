const express = require("express");
const session = require("express-session");
const passport = require("./controllers/PassportFile");
const dotenv = require("dotenv");
const helmet = require("helmet");
const csurf = require("csurf");
const cors = require("cors");
const authRoutes = require("./routes/GoogleAuthRouter");
const refreshTokenRoutes = require("./routes/RefreshTokenRouter");
const userRoutes = require("./routes/UserRouter");
const chatRoutes = require("./routes/ChatRouter");
const stripePaymentRoutes = require("./routes/StripePaymentRouter");
const chatMessageRoutes = require("./routes/ChatMessagesRouter");
const webhookRoutes = require("./routes/WebhookRouter");
const localRoutes = require("./routes/LocalAuthRouter");
const purchaseRoutes = require("./routes/PurchaseRouter");
const cartRoutes = require("./routes/CartRouter");
const productRoutes = require("./routes/ProductsRouter");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");

const app = express();
dotenv.config();
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// const csrfProtection = csurf({ cookie: true });

// Stripe requires the raw body to construct the event
app.use("/", webhookRoutes);
app.use(express.json());
app.use(cookieParser());
// app.use(csrfProtection);

// Set up Helmet middleware for security headers
// app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URI,
    credentials: true,
  })
);

// Set up session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport.js with Google OAuth2 strategy

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  // const csrfToken = req.csrfToken();
  // res.cookie("XSRF-TOKEN", csrfToken);

  res.send("testing 6 " + process.env.FRONTEND_URI);
});

app.use("/", chatRoutes);
// Profile page (protected route)
app.get("/profile", (req, res) => {
  res.send("hello");
});
app.get(
  "/protected",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // This route will only be accessible if a valid JWT is provided in the Authorization header.
    // You can access the authenticated user using req.user.
    res.json({
      message: "Protected route accessed successfully!",
      user: req.user,
    });
  }
);
app.use("/users", userRoutes);
app.use("/", chatMessageRoutes);
app.use("/", localRoutes);
app.use("/auth", authRoutes);
app.use("/", stripePaymentRoutes);
app.use("/", refreshTokenRoutes);
app.use("/purchase", purchaseRoutes);
app.use("/", productRoutes);
app.use("/", cartRoutes);


const endpointSecret = process.env.WEBHOOK_SECRET;

// Start the server
const server = app.listen(process.env.PORT, () => {
  console.log("Server is running on port " + process.env.PORT);
});
// email is hakoci4628@soremap.com

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.FRONTEND_URI,
  },
});

io.on("connection", (socket) => {
  socket.on("connected", () => console.log("connected to socket.io"));

  socket.on("newMessage", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});
