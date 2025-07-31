import React, { useState, useRef, useEffect } from "react";
import Message from "./Message";
import { FaPlus, FaMicrophone, FaImage, FaRegLightbulb, FaStop } from "react-icons/fa";
import "./AnimatedInput.css";

async function fetchGotiLo(messages, model, signal) {
  const response = await fetch(process.env.REACT_APP_GOTILO_API || "http://localhost:5000/api/gemini", {
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

function Chat({ model, messages, onUpdateMessages, userEmail }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const [placeholder, setPlaceholder] = useState("Ask GotiLo");
  const abortControllerRef = useRef(null);
  const [pastedImage, setPastedImage] = useState(null);

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
    if (!input.trim() && !pastedImage) return;

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const userMsg = { role: "user", content: input.trim() };
    if (pastedImage) userMsg.image = pastedImage;
    const newMessages = [...messages, userMsg];
    onUpdateMessages(newMessages);
    setInput("");
    setPastedImage(null);
    setLoading(true);
    setIsTyping(true);

    try {
      const lastUserMessage = [newMessages[newMessages.length - 1]];
      const reply = await fetchGotiLo(lastUserMessage, model, controller.signal);

      const assistantMessage = reply?.startsWith("Error:")
        ? `${reply}\n(If this persists, check your API key, network, or server logs.)`
        : reply;

      // Save chat to backend
      const now = new Date();
      const date = now.toLocaleDateString('en-GB');
      const time = now.toLocaleTimeString('en-GB', { hour12: false });
      const chatheading = `New chat`;
      const userprompt = input.trim();
      const airesponse = assistantMessage;
      const responsetime = 0; // You can measure if needed
      if (userEmail) {
        fetch('http://localhost:5000/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: userEmail, chatheading, userprompt, airesponse, responsetime, date, time })
        });
      }
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

  const handleEditMessage = async (idx, newText) => {
    // Only proceed if editing a user message
    if (messages[idx]?.role !== 'user' || !newText.trim()) return;
    // Replace the user message
    const updated = messages.map((msg, i) =>
      i === idx ? { ...msg, content: newText } : msg
    );
    onUpdateMessages(updated);
    setLoading(true);
    setIsTyping(true);
    const controller = new AbortController();
    abortControllerRef.current = controller;
    try {
      // Only send the edited user message to the backend (like a new prompt)
      const reply = await fetchGotiLo([{ role: 'user', content: newText.trim() }], model, controller.signal);
      const assistantMessage = reply?.startsWith("Error:")
        ? `${reply}\n(If this persists, check your API key, network, or server logs.)`
        : reply;
      // Add the new assistant message after the edited user message
      const newMessages = [
        ...updated.slice(0, idx + 1),
        { role: "assistant", content: assistantMessage },
        ...updated.slice(idx + 1)
      ];
      onUpdateMessages(newMessages);
    } catch (err) {
      const errorMessage = err.name === "AbortError"
        ? "Request cancelled by user."
        : "Error: Could not connect to the server. Please check your network or try again later.";
      const newMessages = [
        ...updated.slice(0, idx + 1),
        { role: "assistant", content: errorMessage },
        ...updated.slice(idx + 1)
      ];
      onUpdateMessages(newMessages);
    } finally {
      setLoading(false);
      setIsTyping(false);
      abortControllerRef.current = null;
    }
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
          // Special case: only 2 messages (user then assistant), show as a single pair
          messages.length === 2 && messages[0].role === 'user' && messages[1].role === 'assistant'
            ? <>
                <Message
                  key={0}
                  text={messages[0].content}
                  sender={messages[0].role}
                  isTyping={false}
                  idx={0}
                  onEdit={handleEditMessage}
                />
                <Message
                  key={1}
                  text={messages[1].content}
                  sender={messages[1].role}
                  isTyping={false}
                  idx={1}
                  onEdit={undefined}
                />
              </>
            : messages.map((msg, idx) => (
                <Message
                  key={idx}
                  text={msg.content}
                  sender={msg.role}
                  isTyping={isTyping && idx === messages.length-1 && msg.role === 'assistant'}
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
              className="animated-border"
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                padding: "5px 10px",
                backgroundColor: "#fff"
              }}
            >
              {pastedImage && (
                <img
                  src={pastedImage}
                  alt="Preview"
                  style={{ maxWidth: 160, maxHeight: 100, borderRadius: 8, marginRight: 12, marginLeft: 4, marginBottom: 4 }}
                />
              )}
              <textarea
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
                  resize: "none",
                  minHeight: "36px",
                  maxHeight: "120px",
                  lineHeight: "1.4",
                  overflowY: "auto"
                }}
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (input.trim() || pastedImage) handleSend(e);
                  }
                }}
                onPaste={async (e) => {
                  const items = e.clipboardData.items;
                  for (let i = 0; i < items.length; i++) {
                    if (items[i].type.indexOf('image') !== -1) {
                      const file = items[i].getAsFile();
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        setPastedImage(ev.target.result);
                      };
                      reader.readAsDataURL(file);
                      e.preventDefault();
                      break;
                    }
                  }
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
