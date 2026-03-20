import React, { useEffect, useState } from "react";
import Notes from "./components/Notes";

function App() {
  const [time, setTime] = useState("");

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/`)
      .then(res => res.json())
      .then(data => setTime(data[0].currentTime))
      .catch(err => console.log(err));
  }, []);

  return (
    <div style={{ maxWidth: "800px", margin: "20px auto", padding: "10px" }}>
      <h1>Backend Time from MySQL:</h1>
      <p>{time}</p>
      <hr />
      <Notes />
    </div>
  );
}

export default App;