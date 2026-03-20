import React, { useState } from "react";
import axios from "axios";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const [message, setMessage] = useState(""); 

  const API_URL = process.env.REACT_APP_API_URL;

  // ✅ Validation function
  const validateForm = () => {
    // Name validation (only alphabets + space)
    if (!isLogin) {
      if (!/^[A-Za-z ]+$/.test(form.name)) {
        setMessage("Name should contain only alphabets and spaces");
        return false;
      }
    }

    // Email validation
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setMessage("Invalid email format");
      return false;
    }

    // Password validation
    if (form.password.length < 6) {
      setMessage("Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    // ✅ Validation call
    if (!validateForm()) return;

    const url = isLogin ? "/auth/login" : "/auth/register";

    axios.post(`${API_URL}${url}`, form)
      .then(res => {
        alert(res.data.message);

        setMessage(res.data.message); 

        // Save token after login
        if (isLogin) {
          localStorage.setItem("token", res.data.token);
          window.location.reload();
        } else {
          // ✅ Clear form after register
          setForm({ name: "", email: "", password: "" });
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
        <input 
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
      )}

      <input 
        placeholder="Email"
        value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
      />

      <input 
        placeholder="Password" 
        type="password"
        value={form.password}
        onChange={e => setForm({ ...form, password: e.target.value })}
      />

      <button onClick={handleSubmit}>
        {isLogin ? "Login" : "Register"}
      </button>

      <p 
        onClick={() => {
          setIsLogin(!isLogin);
          setForm({ name: "", email: "", password: "" }); // ✅ reset
          setMessage(""); // ✅ clear message
        }}
        style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
      >
        Switch to {isLogin ? "Register" : "Login"}
      </p>
    </div>
  );
};

export default Auth;