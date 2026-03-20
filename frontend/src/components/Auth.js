import React, { useState } from "react";
import axios from "axios";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const API_URL = process.env.REACT_APP_API_URL;

  const validateForm = () => {
    if (!isLogin) {
      if (!/^[A-Za-z ]+$/.test(form.name)) {
        setMessage("Name should contain only alphabets and spaces");
        return false;
      }
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setMessage("Invalid email format");
      return false;
    }

    if (form.password.length < 6) {
      setMessage("Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const url = isLogin ? "/auth/login" : "/auth/register";

    axios.post(`${API_URL}${url}`, form)
      .then(res => {
        setMessage(res.data.message);

        if (isLogin) {
          localStorage.setItem("token", res.data.token);
          window.location.reload();
        } else {
          setForm({ name: "", email: "", password: "" });
        }
      })
      .catch(err => {
        if (err.response && err.response.data.message) {
          setMessage(err.response.data.message);
        } else {
          setMessage("Something went wrong");
        }
      });
  };

  return (
    <div style={{
      maxWidth: "400px",
      margin: "100px auto",
      padding: "20px",
      border: "1px solid #ddd",
      borderRadius: "10px",
      boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      textAlign: "center"
    }}>
      <h2>{isLogin ? "Login" : "Register"}</h2>

      {message && <p style={{ color: "red" }}>{message}</p>}

      {!isLogin && (
        <input
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />
      )}

      <input
        placeholder="Email"
        value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <input
        placeholder="Password"
        type="password"
        value={form.password}
        onChange={e => setForm({ ...form, password: e.target.value })}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <button onClick={handleSubmit} style={{
        width: "100%",
        padding: "10px",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer"
      }}>
        {isLogin ? "Login" : "Register"}
      </button>

      <p onClick={() => {
        setIsLogin(!isLogin);
        setForm({ name: "", email: "", password: "" });
        setMessage("");
      }}
        style={{ marginTop: "10px", cursor: "pointer", color: "#007bff" }}>
        Switch to {isLogin ? "Register" : "Login"}
      </p>
    </div>
  );
};

export default Auth;