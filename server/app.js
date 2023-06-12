import express from "express";
import dotenv from "dotenv";
import cors from "cors"
import { VerifyToken, VerifySocketToken } from "./services/verifyToken.js";
import { Server } from "socket.io";
import chatRoomRoute from "./routes/chatRoom.js"
import messageRoute from "./routes/message.js"
import userRoute from "./routes/user.js"

dotenv.config();
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(VerifyToken); 

let PORT = process.env.PORT || 8080

app.use("/room", chatRoomRoute);
app.use("/message", messageRoute);
app.use("/user", userRoute);

const server = app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});

const io = new Server(server, {
  cors: {
    origin: "*"
  },
});

io.use(VerifySocketToken);

let onlineUsers = new Map();

const getKey = (map, val) => {
  map.forEach((value, key) => {
    if (val === value){
      return key;
    }
  })
}

io.on("connection", (socket) => {
  global.chatSocket = socket;

  socket.on("addUser", (userID) => {
    onlineUsers.set(userID, socket.id);
    console.log(9, userID, socket.id);
    console.log(9, Array.from(onlineUsers));
    socket.emit("getUsers", Array.from(onlineUsers));
  });

  socket.on("sendMessage", ({ senderID, receiverID, message, time }) => {
    const sendUserSocket = onlineUsers.get(receiverID);
    if (sendUserSocket) {
      // the event will be broadcast to all connected clients in the room, except this socket
      socket.to(sendUserSocket).emit("getMessage", {
        senderID,
        message,
        time
      });
    }
  });

  socket.on("disconnect", () => {
    onlineUsers.delete(getKey(onlineUsers, socket.id));
    socket.emit("getUsers", Array.from(onlineUsers));
  });
});
