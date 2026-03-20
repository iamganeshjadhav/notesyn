import React, { useEffect, useState } from "react";
import Notes from "./components/Notes";
import Auth from "./components/Auth";
import ActivityLog from "./components/ActivityLog";

function App() {
  const [time, setTime] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/`)
      .then(res => res.json())
      .then(data => setTime(data[0].currentTime))
      .catch(err => console.log(err));

    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div style={{
      maxWidth: "900px",
      margin: "40px auto",
      padding: "20px",
      fontFamily: "Arial, sans-serif"
    }}>

      {/* Header */}
      <div style={{
        textAlign: "center",
        marginBottom: "20px"
      }}>
        <h1 style={{ marginBottom: "5px" }}>🚀 NoteSync</h1>
        <p style={{ color: "gray" }}>Real-time Notes Collaboration App</p>
      </div>

      {/* Backend Time Card */}
      <div style={{
        textAlign: "center",
        padding: "10px",
        marginBottom: "20px",
        backgroundColor: "#f1f1f1",
        borderRadius: "8px"
      }}>
        <strong>Backend Time:</strong> {time}
      </div>

      {/* Main Content */}
      {isLoggedIn ? (
        <>
          <Notes />
          <ActivityLog /> 
        </>
      ) :(<Auth/>)}
    </div>
  );
}

export default App;