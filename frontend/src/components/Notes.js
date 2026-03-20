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

  // ✅ Search state
  const [search, setSearch] = useState("");

  const API_URL = process.env.REACT_APP_API_URL;

  // ✅ Fetch Notes
  const fetchNotes = () => {
    setMessage("Loading notes...");
    axios.get(`${API_URL}/notes`, {
      headers: {
        Authorization: localStorage.getItem("token")
      }
    })
      .then(res => {
        setNotes(res.data);
        setMessage("");
      })
      .catch(() => setMessage("Error fetching notes"));
  };

  // ✅ Socket + Initial Load
  useEffect(() => { 
    fetchNotes();  

    socket.on("noteUpdated", (updatedNote) => {
      setNotes(prevNotes =>
        prevNotes.map(n => n.id === updatedNote.id ? updatedNote : n)
      );
    });

    socket.on("noteAdded", (newNote) => {
      setNotes(prevNotes => [...prevNotes, newNote]);
    });

    socket.on("noteDeleted", (deletedId) => {
      setNotes(prevNotes =>
        prevNotes.filter(n => n.id !== deletedId)
      );
    });

    return () => {
      socket.off("noteUpdated");
      socket.off("noteAdded");
      socket.off("noteDeleted");
    };
  }, []);

  // ✅ FIXED Search Logic (IMPORTANT)
  const filteredNotes = notes.filter(note =>
    (note.title || "").toLowerCase().includes(search.toLowerCase()) ||
    (note.content || "").toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Create Note
  const createNote = () => {
    if (!title.trim()) {
      setMessage("Title required!");
      return;
    }

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

        socket.emit("noteAdded", {
          id: res.data.noteId,
          title,
          content
        });
      })
      .catch(() => setMessage("Error adding note ❌"));
  };

  // ✅ Update Note
  const updateNote = () => {
    if (!title.trim()) {
      setMessage("Title required!");
      return;
    }

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

        socket.emit("noteUpdated", {
          id: editId,
          title,
          content
        });
      })
      .catch(() => setMessage("Error updating note ❌"));
  };

  // ✅ Delete Note
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

  // ✅ Edit Note
  const editNote = (note) => { 
    setEditId(note.id); 
    setTitle(note.title); 
    setContent(note.content); 
    setMessage(""); 
  };

  return (
    <div style={{
      maxWidth: "700px",
      margin: "40px auto",
      padding: "20px",
      border: "1px solid #ddd",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      backgroundColor: "#fafafa"
    }}>
      
      <h2 style={{ textAlign: "center" }}>📝 Notes</h2>

      {/* Logout */}
      <button
        onClick={() => {
          localStorage.removeItem("token");
          window.location.reload();
        }}
        style={{
          marginBottom: "15px",
          padding: "8px 12px",
          backgroundColor: "#dc3545",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        Logout
      </button>

      {/* Message */}
      {message && (
        <p style={{ color: "green", fontWeight: "bold" }}>
          {message}
        </p>
      )}

      {/* Search */}
      <input 
        placeholder="Search notes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "90%",
          padding: "10px",
          marginBottom: "15px",
          borderRadius: "5px",
          border: "1px solid #ccc"
        }}
      />

      {/* Title */}
      <input 
        placeholder="Title" 
        value={title} 
        onChange={e => setTitle(e.target.value)} 
        style={{
          width: "90%",
          padding: "10px",
          marginBottom: "10px",
          borderRadius: "5px",
          border: "1px solid #ccc"
        }}
      />

      {/* Content */}
      <textarea 
        placeholder="Content" 
        value={content} 
        onChange={e => setContent(e.target.value)} 
        style={{
          width: "90%",
          padding: "10px",
          marginBottom: "10px",
          borderRadius: "5px",
          border: "1px solid #ccc"
        }}
      />

      {/* Buttons */}
      {editId ? (
        <button onClick={updateNote} style={{
          padding: "10px 15px",
          backgroundColor: "#ffc107",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginRight: "10px"
        }}>
          Update Note
        </button>
      ) : (
        <button onClick={createNote} style={{
          padding: "10px 15px",
          backgroundColor: "#28a745",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginRight: "10px"
        }}>
          Add Note
        </button>
      )}

      {/* Notes List */}
      <ul style={{
        listStyle: "none",
        padding: 0,
        marginTop: "20px"
      }}>
        {filteredNotes.map(note => (
          <li key={note.id} style={{
            border: "1px solid #ddd",
            padding: "15px",
            marginBottom: "10px",
            borderRadius: "8px",
            backgroundColor: "white"
          }}>
            <h3>{note.title}</h3>
            <p>{note.content}</p>

            <button onClick={() => editNote(note)} style={{
              marginRight: "10px",
              padding: "6px 10px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}>
              Edit
            </button>

            <button onClick={() => deleteNote(note.id)} style={{
              padding: "6px 10px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}>
              Delete
            </button>
          </li>
        ))}
      </ul>

    </div>
  );
};

export default Notes;