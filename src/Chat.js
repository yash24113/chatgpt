import React, { useState, useRef, useEffect } from "react";
import Message from "./Message";
import { FaPlus, FaMicrophone, FaImage, FaRegLightbulb, FaStop } from "react-icons/fa";

async function fetchGotiLo(messages, model, signal) {
  const response = await fetch(process.env.REACT_APP_GOTILO_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, model }),
    signal,
  });
  const data = await response.json();
  return data.reply;
}

const sendIcon = (
  <img
    src="https://cdn-icons-png.flaticon.com/256/9187/9187575.png"
    alt="Send"
    style={{ width: 24, height: 24 }}
  />
);

const userAvatar = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQoYalG0iZwdwwSFMhNL4aDADjcSJFcuo31Y9OY6saF8ZG5dq3lLc8uXw0eJfUwvdwjTw&usqp=CAU';

function getGreeting(name = "Yash") {
  const hour = new Date().getHours();
  let greeting = "Good Morning";
  if (hour >= 12 && hour < 16) greeting = "Good Afternoon";
  else if (hour >= 16 || hour < 23) greeting = "Good Evening";
  return `${greeting}, ${name}`;
}

function Chat({ model, messages, onUpdateMessages }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const [placeholder, setPlaceholder] = useState("Ask GotiLo");
  const abortControllerRef = useRef(null);

  useEffect(() => {
    const phrases = ["Ask GotiLo", "Ask GotiLo.", "Ask GotiLo..", "Ask GotiLo..."];
    let idx = 0;
    const interval = setInterval(() => {
      setPlaceholder(phrases[idx]);
      idx = (idx + 1) % phrases.length;
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const newMessages = [...messages, { role: "user", content: input.trim() }];
    onUpdateMessages(newMessages);
    setInput("");
    setLoading(true);
    setIsTyping(true);

    try {
      const lastUserMessage = [newMessages[newMessages.length - 1]];
      const reply = await fetchGotiLo(lastUserMessage, model, controller.signal);

      const assistantMessage = reply?.startsWith("Error:")
        ? `${reply}\n(If this persists, check your API key, network, or server logs.)`
        : reply;

      onUpdateMessages([...newMessages, { role: "assistant", content: assistantMessage }]);
    } catch (err) {
      const errorMessage = err.name === "AbortError"
        ? "Request cancelled by user."
        : "Error: Could not connect to the server. Please check your network or try again later.";

      onUpdateMessages([...newMessages, { role: "assistant", content: errorMessage }]);
    } finally {
      setLoading(false);
      setIsTyping(false);
      abortControllerRef.current = null;
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
  };

  const handleEditMessage = (idx, newText) => {
    const updated = messages.map((msg, i) =>
      i === idx ? { ...msg, content: newText } : msg
    );
    onUpdateMessages(updated);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const isGreeting = messages.length === 1 && messages[0].role === "assistant";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        maxHeight: "100vh",
        padding: "10px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "10px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {isGreeting ? (
          <div
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              background: "linear-gradient(90deg, #4f8cff, #ff6ec4, #f9d423, #4f8cff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textAlign: "center",
              marginTop: "8vh",
              marginBottom: "8vh",
            }}
          >
            {getGreeting("Yash")}
          </div>
        ) : (
          messages.map((msg, idx) => (
            <Message
              key={idx}
              text={msg.content}
              sender={msg.role}
              isTyping={isTyping}
              idx={idx}
              onEdit={msg.role === "user" ? handleEditMessage : undefined}
            />
          ))
        )}
        {loading && <Message text="Typing..." sender="assistant" isTyping />}
        <div ref={messagesEndRef} />
      </div>

      {loading ? (
        <div style={{ padding: "10px", textAlign: "center" }}>
          <button
            onClick={handleStop}
            style={{
              backgroundColor: "#ff4d4f",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            <FaStop style={{ marginRight: "5px" }} />
            Stop generating
          </button>
        </div>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              padding: "10px",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <form
              onSubmit={handleSend}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                border: "1px solid #ccc",
                borderRadius: "30px",
                padding: "5px 10px",
                backgroundColor: "#fff",
              }}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={placeholder}
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  padding: "10px",
                  fontSize: "1rem",
                  background: "transparent",
                }}
              />
              <button
                type="submit"
                disabled={!input.trim()}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: input.trim() ? "pointer" : "not-allowed",
                  padding: "6px",
                }}
              >
                {input.trim() ? (
                  <img
                    src={userAvatar}
                    alt="Send"
                    style={{ width: 28, height: 28, borderRadius: "50%" }}
                  />
                ) : (
                  sendIcon
                )}
              </button>
            </form>
          </div>

          {/* Toolbar */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "10px",
              fontSize: "0.9rem",
              paddingBottom: "5px",
              color: "#555",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <FaPlus /> Deep Research
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <FaRegLightbulb /> Canvas
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <FaImage /> Image
            </span>
          </div>

          {/* Footer */}
          <div
            style={{
              textAlign: "center",
              fontSize: "0.8rem",
              color: "#888",
              padding: "5px",
            }}
          >
            GotiLo can make mistakes, so double-check it
          </div>
        </>
      )}
    </div>
  );
}

export default Chat;
