const express = require("express");
const cors = require("cors");
const http = require("http");              // HTTP server
const { Server } = require("socket.io");  // Socket.io
require("dotenv").config();
const authRoutes = require("./routes/auth");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }   // Frontend connect साठी
});

// Socket.io connection
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Listen for note updates
  socket.on("noteUpdated", (note) => {
    // Broadcast updated note to all clients except sender
    socket.broadcast.emit("noteUpdated", note);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Routes
const notesRoutes = require("./routes/notes");
app.use("/notes", notesRoutes);

app.get("/", (req, res) => {
  const currentTime = new Date().toLocaleString();
  res.json([{ currentTime }]);
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));