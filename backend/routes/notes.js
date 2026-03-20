const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Get all notes
router.get("/", (req, res) => {
  db.query("SELECT * FROM notes", (err, result) => {
    if(err) res.status(500).json(err);
    else res.json(result);
  });
});

// Get note by ID
router.get("/:id", (req, res) => {
  const noteId = req.params.id;
  db.query("SELECT * FROM notes WHERE id = ?", [noteId], (err, result) => {
    if(err) res.status(500).json(err);
    else res.json(result);
  });
});

// Create note
router.post("/", (req, res) => {
  const { title, content, owner_id } = req.body;
  db.query("INSERT INTO notes (title, content, owner_id) VALUES (?, ?, ?)", [title, content, owner_id], (err, result) => {
    if(err) res.status(500).json(err);
    else res.json({ message: "Note created", noteId: result.insertId });
  });
});

// Update note
router.put("/:id", (req, res) => {
  const noteId = req.params.id;
  const { title, content } = req.body;
  db.query("UPDATE notes SET title = ?, content = ? WHERE id = ?", [title, content, noteId], (err, result) => {
    if(err) res.status(500).json(err);
    else res.json({ message: "Note updated" });
  });
});

// Delete note
router.delete("/:id", (req, res) => {
  const noteId = req.params.id;
  db.query("DELETE FROM notes WHERE id = ?", [noteId], (err, result) => {
    if(err) res.status(500).json(err);
    else res.json({ message: "Note deleted" });
  });
});

module.exports = router;