import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios for making HTTP requests
import "./Chat.css"; // Import the CSS file for styling

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const navigate = useNavigate();
  const messageInput = useRef(null); // Ref for the input field to focus after sending

  // Function to send the message to the backend (Django API)
  const sendMessageToBackend = async (message) => {
    try {
      const response = await axios.post("http://localhost:8000/chat/chatbot/", {
        message: message,
      });

      const botReply = response.data.reply;
      // Add the message from the user and the bot's reply to the message history
      setMessages((prev) => [
        ...prev,
        { sender: "user", text: message },
        { sender: "bot", text: botReply },
      ]);
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      sendMessageToBackend(newMessage);
      setNewMessage(""); // Clear the input field after sending the message
      messageInput.current.focus(); // Ensure focus after sending
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
                    msg.sender === "user"
                      ? "user-message text-end"
                      : "bot-message text-start"
                  }`}
                  style={{
                    display: "inline-block",
                    padding: "10px 15px",
                    fontSize: "1rem",
                    maxWidth: "80%",
                    backgroundColor: msg.sender === "user" ? "#6f42c1" : "#e9ecef", // Purple for user, light background for bot
                    color: msg.sender === "user" ? "white" : "black",
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
