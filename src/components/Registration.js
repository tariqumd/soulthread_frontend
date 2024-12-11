import React, { useState, useEffect } from "react";
import { useNavigate,Link } from "react-router-dom";
import axios from "axios";
import "./Registration.css";

const Registration = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Check if already logged in
  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
        navigate("/chat"); // Redirect to chat if already logged in
    }
    }, [navigate]);
    
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      await axios.post("http://localhost:8000/chat/register/", {
        username,
        email,
        password,
        first_name: firstName,
        last_name: lastName,
      });

      setSuccess(true);
      setTimeout(() => navigate("/"), 2000); // Redirect after success
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError("Registration failed. Please check your inputs.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="reg-container">
    <div className="reg-card">
      <img src="favicon.ico" className="logo-reg" alt-text="logo"></img>
      {error && <p>{error}</p>}
      {success && <p>Registration successful! Redirecting to login...</p>}
      <form onSubmit={handleRegister} className="reg-form">
      <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account? <Link to="/">Login here</Link>
      </p>
    </div>
    </div>
  );
};

export default Registration;
