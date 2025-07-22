import React, { useState, useRef, useEffect } from "react";
import Message from "./Message";
import { FaPlus, FaMicrophone, FaImage, FaRegLightbulb, FaStop } from "react-icons/fa";

async function fetchGotiLo(messages, model, signal) {
  const response = await fetch('https://gotilo-backend.vercel.app/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, model }),
    signal,
  });
  const data = await response.json();
  return data.reply;
}

const sendIcon = (
  <img src="https://cdn-icons-png.flaticon.com/256/9187/9187575.png" alt="Send" className="send-img-icon" />
);

const userAvatar = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQoYalG0iZwdwwSFMhNL4aDADjcSJFcuo31Y9OY6saF8ZG5dq3lLc8uXw0eJfUwvdwjTw&usqp=CAU';
const assistantAvatar = 'https://thumbs.dreamstime.com/b/chat-bot-icon-virtual-assistant-automation-flat-line-color-style-363583472.jpg';

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
    const phrases = [
      "Ask GotiLo",
      "Ask GotiLo.",
      "Ask GotiLo..",
      "Ask GotiLo..."
    ];
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

    const newMessages = [
      ...messages,
      { role: "user", content: input.trim() },
    ];
    onUpdateMessages(newMessages);
    setInput("");
    setLoading(true);
    setIsTyping(true);

    try {
      // Create a new array with only the last user message for the API call
      const lastUserMessage = [newMessages[newMessages.length - 1]];
      const reply = await fetchGotiLo(lastUserMessage, model, controller.signal);
      
      // If reply starts with 'Error:', show a user-friendly message
      if (reply && reply.startsWith('Error:')) {
        onUpdateMessages([
          ...newMessages,
          { role: "assistant", content: reply + "\n(If this persists, check your API key, network, or server logs.)" },
        ]);
      } else {
        onUpdateMessages([...newMessages, { role: "assistant", content: reply }]);
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        onUpdateMessages([
          ...newMessages,
          { role: "assistant", content: "Request cancelled by user." },
        ]);
      } else {
        onUpdateMessages([
          ...newMessages,
          { role: "assistant", content: "Error: Could not connect to the server. Please check your network or try again later." },
        ]);
      }
    } finally {
      setLoading(false);
      setIsTyping(false);
      abortControllerRef.current = null;
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  // Edit user message handler
  const handleEditMessage = (idx, newText) => {
    const updated = messages.map((msg, i) =>
      i === idx ? { ...msg, content: newText } : msg
    );
    onUpdateMessages(updated);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const isGreeting = messages.length === 1 && messages[0].role === "assistant";

  return (
    <div className="chat-outer-container">
      <div className="messages">
        {isGreeting ? (
          <div className="gemini-greeting" style={{
            fontSize: '2.8rem',
            fontWeight: 'bold',
            background: 'linear-gradient(90deg, #4f8cff, #ff6ec4, #f9d423, #4f8cff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            textAlign: 'center',
            marginTop: '8vh',
            marginBottom: '8vh',
          }}>{getGreeting("Yash")}</div>
        ) : (
          messages.map((msg, idx) => (
            <Message
              key={idx}
              text={msg.content}
              sender={msg.role}
              isTyping={isTyping}
              idx={idx}
              onEdit={msg.role === 'user' ? handleEditMessage : undefined}
            />
          ))
        )}
        {loading && <Message text="Typing..." sender="assistant" isTyping={isTyping} />}
        <div ref={messagesEndRef} />
      </div>

      {loading ? (
        <div className="stop-generating-container">
          <button onClick={handleStop} className="stop-btn">
            <FaStop /> Stop generating
          </button>
        </div>
      ) : (
        <>
          <div className="input-form">
            {/* <img src={userAvatar} alt="User" className="input-avatar" /> */}
            <form className="input-row" onSubmit={handleSend} style={{ flex: 1 }}>
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={placeholder}
              />
              <button type="submit" className="send-btn" disabled={!input.trim()}>
                {input.trim() ? (
                  <img src={userAvatar} alt="Send" className="send-avatar" />
                ) : (
                  sendIcon
                )}
              </button>
            </form>
          </div>
          <div className="input-toolbar">
            <span><FaPlus /> Deep Research</span>
            <span><FaRegLightbulb /> Canvas</span>
            <span><FaImage /> Image</span>
          </div>
          <div className="GotiLo-footer">GotiLo can make mistakes, so double-check it</div>
        </>
      )}
    </div>
  );
}

export default Chat; 
