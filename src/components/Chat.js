import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Chat.css";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef(null); // WebSocket reference
  const navigate = useNavigate();
  const messageInput = useRef(null); // Ref for the input field to focus after sending

  useEffect(() => {
    // Establish WebSocket connection directly to Django WebSocket endpoint
    const connectWebSocket = () => {
      // Check if the WebSocket is already open
      if (ws.current && ws.current.readyState === WebSocket.OPEN) return;

      ws.current = new WebSocket("ws://localhost:8000/ws/chat/soulthread/"); // Direct WebSocket connection

      ws.current.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data); // Parse JSON messages from Django
          setMessages((prev) => [
            ...prev,
            { sender: data.sender || "bot", text: data.message },
          ]);
        } catch (err) {
          console.error("Error parsing WebSocket message:", err);
        }
      };

      ws.current.onclose = () => {
        console.log("WebSocket disconnected");
        setIsConnected(false);
        // Attempt to reconnect after 3 seconds
        setTimeout(connectWebSocket, 3000);
      };

      ws.current.onerror = (err) => {
        console.error("WebSocket error:", err);
        setIsConnected(false);
      };
    };

    connectWebSocket(); // Start WebSocket connection on mount

    return () => {
      if (ws.current) {
        ws.current.close(); // Cleanup WebSocket connection when component unmounts
      }
    };
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        // Send the message to Django WebSocket server
        ws.current.send(
          JSON.stringify({
            sender: "user",
            message: newMessage,
          })
        );
        setMessages((prev) => [
          ...prev,
          { sender: "user", text: newMessage },
        ]);
        setNewMessage("");
        messageInput.current.focus(); // Ensure focus after sending
      } else {
        console.log("WebSocket is not connected. Retrying...");
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevents new line creation
      handleSendMessage();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/");
  };

  return (
    <div className="container-fluid p-0">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            SoulThread
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <button className="btn btn-outline-light" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Layout */}
      <div className="row g-0" style={{ height: "calc(100vh - 56px)" }}>
        {/* Sidebar */}
        <div className="col-2 bg-light border-end p-3">
          <h5>Filters</h5>
          <button className="btn btn-primary w-100 mb-2">All Chats</button>
          <button className="btn btn-primary w-100 mb-2">Unread</button>
          <button className="btn btn-primary w-100 mb-2">Favorites</button>
        </div>

        {/* Chat Window */}
        <div className="col-10 d-flex flex-column">
          {/* Chat Messages */}
          <div
            className="flex-grow-1 p-3"
            style={{
              overflowY: "auto",
              backgroundColor: "#f9f9f9",
            }}
          >
            {messages.map((msg, index) => (
              <div key={index} style={{ display: "block", marginBottom: "10px" }}>
                <div
                  className={`p-2 rounded ${
                    msg.sender === "user" ? "user-message text-end" : "bg-light text-dark"
                  }`}
                  style={{
                    display: "inline-block",
                    padding: "10px 15px",
                    fontSize: "1rem",
                    maxWidth: "80%",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="border-top p-3 bg-white d-flex">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              ref={messageInput}
            />
            <button className="btn btn-primary" onClick={handleSendMessage}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
