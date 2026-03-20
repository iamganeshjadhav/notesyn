import React, { useState } from "react";
import axios from "axios";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const [message, setMessage] = useState(""); 

  const API_URL = process.env.REACT_APP_API_URL;

  const handleSubmit = () => {
    const url = isLogin ? "/auth/login" : "/auth/register";

    axios.post(`${API_URL}${url}`, form)
      .then(res => {
        alert(res.data.message);

        setMessage(res.data.message); 

        // Save token after login
        if (isLogin) {
          localStorage.setItem("token", res.data.token);
          window.location.reload();
        }
      })
      .catch(err => {
        console.log(err);

        
        if (err.response && err.response.data.message) {
          setMessage(err.response.data.message);
        } else {
          setMessage("Something went wrong");
        }
      });
  };

  return (
    <div>
      <h2>{isLogin ? "Login" : "Register"}</h2>

      
      {message && <p style={{ color: "red" }}>{message}</p>}

      {!isLogin && (
        <input placeholder="Name"
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
      )}

      <input placeholder="Email"
        onChange={e => setForm({ ...form, email: e.target.value })}
      />

      <input placeholder="Password" type="password"
        onChange={e => setForm({ ...form, password: e.target.value })}
      />

      <button onClick={handleSubmit}>
        {isLogin ? "Login" : "Register"}
      </button>

      <p onClick={() => setIsLogin(!isLogin)}
        style={{ cursor: "pointer", color: "blue" }}>
        Switch to {isLogin ? "Register" : "Login"}
      </p>
    </div>
  );
};

export default Auth;