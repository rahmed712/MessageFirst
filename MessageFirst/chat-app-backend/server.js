/** Import dependencies for server setup */
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const socket = require("socket.io");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors()); // to prevent cors errors, open access to all origins
app.use(express.json()); // parse json bodies
app.use(morgan("dev")); // logging

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// db connection
const { PORT, MONGODB_URL } = process.env;
mongoose.connect(MONGODB_URL);
mongoose.connection
  .on("open", () => console.log("Connected to Database: Successful!"))
  .on("close", () => console.log("Disconnected"))
  .on("error", (error) => console.log(error));

// Create server
const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Server started on PORT ${process.env.PORT}`);
});

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});
