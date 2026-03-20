const express = require("express");
const cors = require("cors");
const http = require("http");              // HTTP server
const { Server } = require("socket.io");  // Socket.io
require("dotenv").config();

const authRoutes = require("./routes/auth");
const { router: notesRoutes, setSocket } = require("./routes/notes"); // Updated import

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);

// Create HTTP server + Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }   // Frontend connect साठी
});

// ✅ Pass io to notes.js for realtime activity
setSocket(io);

// Socket.io connection
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Listen for note updates (optional: Notes component already fetches via API)
  socket.on("noteUpdated", (note) => {
    socket.broadcast.emit("noteUpdated", note);
  });

  socket.on("noteAdded", (note) => {
    socket.broadcast.emit("noteAdded", note);
  });

  socket.on("noteDeleted", (noteId) => {
    socket.broadcast.emit("noteDeleted", noteId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Notes routes (protected + activity logging)
app.use("/notes", notesRoutes);

// Health check / backend time
app.get("/", (req, res) => {
  const currentTime = new Date().toLocaleString();
  res.json([{ currentTime }]);
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));