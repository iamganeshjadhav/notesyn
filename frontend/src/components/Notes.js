import React, { useEffect, useState } from "react";
import axios from "axios";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");

  const API_URL = process.env.REACT_APP_API_URL;

  const fetchNotes = () => {
    setMessage("Loading notes...");
    axios.get(`${API_URL}/notes`)
      .then(res => { setNotes(res.data); setMessage(""); })
      .catch(() => setMessage("Error fetching notes"));
  };

  useEffect(() => { fetchNotes(); }, []);

  const createNote = () => {
    if (!title.trim()) { setMessage("Title required!"); return; }
    axios.post(`${API_URL}/notes`, { title, content, owner_id: 1 })
      .then(() => { setTitle(""); setContent(""); setMessage("Note added ✅"); fetchNotes(); })
      .catch(() => setMessage("Error adding note ❌"));
  };

  const updateNote = () => {
    if (!title.trim()) { setMessage("Title required!"); return; }
    axios.put(`${API_URL}/notes/${editId}`, { title, content })
      .then(() => { setTitle(""); setContent(""); setEditId(null); setMessage("Note updated ✅"); fetchNotes(); })
      .catch(() => setMessage("Error updating note ❌"));
  };

  const deleteNote = (id) => {
    axios.delete(`${API_URL}/notes/${id}`)
      .then(() => { setMessage("Note deleted ✅"); fetchNotes(); })
      .catch(() => setMessage("Error deleting note ❌"));
  };

  const editNote = (note) => { setEditId(note.id); setTitle(note.title); setContent(note.content); setMessage(""); };

  return (
    <div style={{ maxWidth: "600px", margin: "20px auto", padding: "10px", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h2>Notes</h2>
      {message && <p style={{ color: "green", fontWeight: "bold" }}>{message}</p>}
      <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} style={{ width: "100%", padding: "8px", marginBottom: "8px" }} />
      <textarea placeholder="Content" value={content} onChange={e => setContent(e.target.value)} style={{ width: "100%", padding: "8px", marginBottom: "8px" }} />
      {editId ? <button onClick={updateNote} style={{ marginRight: "8px" }}>Update Note</button> : <button onClick={createNote} style={{ marginRight: "8px" }}>Add Note</button>}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {notes.map(note => (
          <li key={note.id} style={{ border: "1px solid #ddd", padding: "10px", marginBottom: "8px", borderRadius: "4px" }}>
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <button onClick={() => editNote(note)} style={{ marginRight: "8px" }}>Edit</button>
            <button onClick={() => deleteNote(note.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notes;