import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io(process.env.REACT_APP_API_URL); // Backend connect

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");

  const API_URL = process.env.REACT_APP_API_URL;

  const fetchNotes = () => {
    setMessage("Loading notes...");
    axios.get(`${API_URL}/notes`, {
      headers: {
        Authorization: localStorage.getItem("token")
      }
    })
      .then(res => { setNotes(res.data); setMessage(""); })
      .catch(() => setMessage("Error fetching notes"));
  };

  useEffect(() => { 
    fetchNotes();  

    socket.on("noteUpdated", (updatedNote) => {
      setNotes(prevNotes => prevNotes.map(n => n.id === updatedNote.id ? updatedNote : n));
    });

    socket.on("noteAdded", (newNote) => {
      setNotes(prevNotes => [...prevNotes, newNote]);
    });

    socket.on("noteDeleted", (deletedId) => {
      setNotes(prevNotes => prevNotes.filter(n => n.id !== deletedId));
    });

    return () => {
      socket.off("noteUpdated");
      socket.off("noteAdded");
      socket.off("noteDeleted");
    };
  }, []);

  const createNote = () => {
    if (!title.trim()) { setMessage("Title required!"); return; }
    axios.post(`${API_URL}/notes`, 
      { title, content, owner_id: 1 },
      {
        headers: {
          Authorization: localStorage.getItem("token")
        }
      }
    )
      .then((res) => { 
        setTitle(""); 
        setContent(""); 
        setMessage("Note added ✅"); 
        fetchNotes(); 

        socket.emit("noteAdded", { id: res.data.noteId, title, content });
      })
      .catch(() => setMessage("Error adding note ❌"));
  };

  const updateNote = () => {
    if (!title.trim()) { setMessage("Title required!"); return; }
    axios.put(`${API_URL}/notes/${editId}`, 
      { title, content },
      {
        headers: {
          Authorization: localStorage.getItem("token")
        }
      }
    )
      .then(() => { 
        setTitle(""); 
        setContent(""); 
        setEditId(null); 
        setMessage("Note updated ✅"); 
        fetchNotes(); 

        socket.emit("noteUpdated", { id: editId, title, content });
      })
      .catch(() => setMessage("Error updating note ❌"));
  };

  const deleteNote = (id) => {
    axios.delete(`${API_URL}/notes/${id}`, {
      headers: {
        Authorization: localStorage.getItem("token")
      }
    })
      .then(() => { 
        setMessage("Note deleted ✅"); 
        fetchNotes(); 

        socket.emit("noteDeleted", id);
      })
      .catch(() => setMessage("Error deleting note ❌"));
  };

  const editNote = (note) => { 
    setEditId(note.id); 
    setTitle(note.title); 
    setContent(note.content); 
    setMessage(""); 
  };

  return (
    <div style={{ maxWidth: "600px", margin: "20px auto", padding: "10px", border: "1px solid #ccc", borderRadius: "8px" }}>
      
      <h2>Notes</h2>

      {/* ✅ Logout Button */}
      <button onClick={() => {
        localStorage.removeItem("token");
        window.location.reload();
      }} style={{ marginBottom: "10px" }}>
        Logout
      </button>

      {message && <p style={{ color: "green", fontWeight: "bold" }}>{message}</p>}

      <input 
        placeholder="Title" 
        value={title} 
        onChange={e => setTitle(e.target.value)} 
        style={{ width: "100%", padding: "8px", marginBottom: "8px" }} 
      />

      <textarea 
        placeholder="Content" 
        value={content} 
        onChange={e => setContent(e.target.value)} 
        style={{ width: "100%", padding: "8px", marginBottom: "8px" }} 
      />

      {editId ? 
        <button onClick={updateNote} style={{ marginRight: "8px" }}>Update Note</button> : 
        <button onClick={createNote} style={{ marginRight: "8px" }}>Add Note</button>
      }

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