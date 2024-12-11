import React, { useState , useEffect} from "react";
import { useNavigate, Link} from "react-router-dom";
import axios from "axios";
import "./Login.css";


const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Check if already logged in
  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      navigate("/chat"); // Redirect to chat if already logged in
    }
  }, [navigate]);


  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      // Call the backend login API
      const response = await axios.post("http://localhost:8000/chat/login/", {
        username,
        password,
      });

      // Save the tokens in local storage
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);

      // Redirect to chat page
      navigate("/chat");
    } catch (err) {
      // Handle errors (e.g., invalid credentials)
      if (err.response && err.response.status === 400) {
        setError("Invalid username or password.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img src="favicon.ico" className="logo-login" alt-text="logo"></img>
        {/* <h1 className="app-title">SoulThread</h1> */}
        <form onSubmit={handleLogin} className="login-form">
        <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        <p>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
      </div>
    </div>
  );
};

export default Login;
