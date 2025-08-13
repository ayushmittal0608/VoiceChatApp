import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import VoiceChatControls from "./VoiceChatControls";
import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/outline";

function ChatbotButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/voice-chat")}
      aria-label="Open Voice Chat"
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: "60px",
        height: "60px",
        borderRadius: "50%",
        backgroundColor: "#000000",
        border: "none",
        cursor: "pointer",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
        zIndex: 1000,
      }}
    >
      <ChatBubbleLeftEllipsisIcon style={{ width: 28, height: 28, color: "white" }} />
    </button>
  );
}

// Typewriter component without erase
function Typewriter({ text, speed = 100 }) {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, index + 1));
        setIndex(index + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [index, text, speed]);

  return <h1 style={{ fontFamily: "cursive", whiteSpace: "pre" }}>{displayedText}|</h1>;
}

export default function App() {
  return (
    <Router>
      <ChatbotButton />
      <Routes>
        <Route path="/voice-chat" element={<VoiceChatControls />} />
        <Route
          path="/"
          element={
            <div style={{ padding: "2rem" }}>
              <Typewriter text="Welcome to the Voice Chat App" />
              <p style={{fontFamily: "cursive"}}>Click the chatbot icon at bottom-right to open voice chat.</p>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}
