const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const fs = require("fs");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {

    socket.on("disconnect", () => {
        const user = userLeave(socket.id);
        if (user) {
          io.to(user.room).emit(
            "message",
            formatMessage("Server BOT", `${user.username} is no longer with us`)
          );
    
          io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getRoomUsers(user.room),
          });
        }
      });
});

const PORT = 8080 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));