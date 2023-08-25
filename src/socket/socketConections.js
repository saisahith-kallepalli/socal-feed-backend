const io = require("socket.io");
const socketIOJwt = require("socketio-jwt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { createOrJoinChatroom } = require("../controllers/chat.controller");

function socketIo(server) {
  const socketServer = io(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    },
  });
  const chat = socketServer.of("/chat");

  chat.use(async (socket, next) => {
    console.log(socket.handshake.auth);
    await jwt.verify(
      socket.handshake.auth.token,
      process.env.JWT_SECRET,
      async (err, decoded) => {
        if (err) {
          return next(new ApiError(httpStatus.UNAUTHORIZED, "Invalid token"));
        }
        const user = await User.findById(decoded.sub);
        socket.decoded = user;
        next();
      }
    );
  });
  chat.on("connection", (socket) => {
    console.log("a user connected");
    console.info(socket.decoded, "====>decoded");
    socket.on("joinChat", (data) => {
      createOrJoinChatroom({
        userId: String(socket.decoded._id),
        personId: data.personId,
      });
      socket.join(data.room);
      chat.in(data.room).emit("message", `user joined in ${data.room}`);
    });
    socket.on("disconnect", () => {
      console.log("a user disconnected");
    });
  });
}
module.exports = socketIo;
