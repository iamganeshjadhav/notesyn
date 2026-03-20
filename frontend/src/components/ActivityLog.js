import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

// ✅ Initialize socket connection
const socket = io(process.env.REACT_APP_API_URL);

const ActivityLog = () => {
  const [logs, setLogs] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    // ✅ Fetch logs from backend initially
    const fetchLogs = async () => {
      try {
        const res = await axios.get(`${API_URL}/notes/logs/all`, {
          headers: { Authorization: localStorage.getItem("token") }
        });
        setLogs(res.data);
      } catch (err) {
        console.error("Error fetching logs:", err);
      }
    };

    fetchLogs();

    // ✅ Listen for realtime updates
    socket.on("newActivity", (activity) => {
      setLogs(prev => [activity, ...prev]); // prepend new activity
    });

    // ✅ Cleanup listener
    return () => socket.off("newActivity");
  }, [API_URL]);

  return (
    <div style={{ marginTop: "30px" }}>
      <h2>📊 Activity Logs</h2>

      {logs.length === 0 ? (
        <p>No activity yet...</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {logs.map((log, index) => (
            <li key={index} style={{
              marginBottom: "10px",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "6px",
              backgroundColor: "#f9f9f9"
            }}>
              <strong>{log.action}</strong> - Note ID: {log.note_id} - <em>{new Date(log.created_at).toLocaleString()}</em>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ActivityLog;