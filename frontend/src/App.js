import React, { useEffect, useState } from "react";
import Notes from "./components/Notes";
import Auth from "./components/Auth";

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
    <div style={{ maxWidth: "800px", margin: "20px auto", padding: "10px" }}>
      <h1>Backend Time from MySQL:</h1>
      <p>{time}</p>

      <hr />

      {isLoggedIn ? <Notes /> : <Auth />}

    </div>
  );
}

export default App;