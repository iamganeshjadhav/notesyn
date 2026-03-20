// backend/routes/notes.js
const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const verifyToken = require("../middleware/authMiddleware");
require("dotenv").config();

// ✅ IMPORTANT: io object from server
let io;
const setSocket = (socketIo) => { io = socketIo; };

// DB Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// -------------------
// Activity Logger Function
// -------------------
const logActivity = (action, noteId, userId) => {
  const created_at = new Date();
  db.query(
    "INSERT INTO activity_logs (action, note_id, user_id, created_at) VALUES (?, ?, ?, ?)",
    [action, noteId, userId, created_at],
    (err) => {
      if(err) console.log("Activity log error:", err);

      // ✅ Emit realtime activity
      if(io) {
        io.emit("newActivity", { action, note_id: noteId, user_id: userId, created_at });
      }
    }
  );
};

// -------------------
// Get all notes (protected)
// -------------------
router.get("/", verifyToken, (req, res) => {
  db.query("SELECT * FROM notes", (err, result) => {
    if(err) res.status(500).json(err);
    else res.json(result);
  });
});

// -------------------
// Get single note by ID
// -------------------
router.get("/:id", verifyToken, (req, res) => {
  const noteId = req.params.id;
  db.query("SELECT * FROM notes WHERE id = ?", [noteId], (err, result) => {
    if(err) res.status(500).json(err);
    else res.json(result);
  });
});

// -------------------
// Create note
// -------------------
router.post("/", verifyToken, (req, res) => {
  const { title, content } = req.body;
  const owner_id = req.user.id;

  db.query(
    "INSERT INTO notes (title, content, owner_id) VALUES (?, ?, ?)",
    [title, content, owner_id],
    (err, result) => {
      if(err) return res.status(500).json(err);

      // Log activity + emit
      logActivity("CREATE", result.insertId, owner_id);

      res.json({ message: "Note created", noteId: result.insertId });
    }
  );
});

// -------------------
// Update note
// -------------------
router.put("/:id", verifyToken, (req, res) => {
  const noteId = req.params.id;
  const { title, content } = req.body;

  db.query(
    "UPDATE notes SET title = ?, content = ? WHERE id = ?",
    [title, content, noteId],
    (err) => {
      if(err) return res.status(500).json(err);

      // Log activity + emit
      logActivity("UPDATE", noteId, req.user.id);

      res.json({ message: "Note updated" });
    }
  );
});

// -------------------
// Delete note
// -------------------
router.delete("/:id", verifyToken, (req, res) => {
  const noteId = req.params.id;

  db.query("DELETE FROM notes WHERE id = ?", [noteId], (err) => {
    if(err) return res.status(500).json(err);

    // Log activity + emit
    logActivity("DELETE", noteId, req.user.id);

    res.json({ message: "Note deleted" });
  });
});

// -------------------
// Get all activity logs (protected)
// -------------------
router.get("/logs/all", verifyToken, (req, res) => {
  db.query(
    "SELECT * FROM activity_logs ORDER BY created_at DESC",
    (err, result) => {
      if(err) res.status(500).json(err);
      else res.json(result);
    }
  );
});

module.exports = { router, setSocket };