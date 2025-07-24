import React, { useState, useEffect } from "react";
import Chat from "./Chat";
import Login from "./Login";
import "./App.css";
import { FaBars, FaCog, FaPlus, FaUserCircle, FaPencilAlt } from "react-icons/fa";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('token'));

  // Handle login success
  const handleLoginSuccess = (token) => {
    localStorage.setItem('token', token);
    setIsLoggedIn(true);
  }
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [model, setModel] = useState("gemini-1.5-flash");
  const [modelDropdown, setModelDropdown] = useState(false);
  const [chats, setChats] = useState([
    { id: 1, name: "New chat", messages: [ { role: "assistant", content: "Hello, Yash" } ] }
  ]);
  const [currentChatId, setCurrentChatId] = useState(1);
  const [chatCounter, setChatCounter] = useState(2);
  const models = ["gemini-1.5-flash"];
  const [editingChatId, setEditingChatId] = useState(null);
  const [editingChatName, setEditingChatName] = useState("");
  const userAvatar = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQoYalG0iZwdwwSFMhNL4aDADjcSJFcuo31Y9OY6saF8ZG5dq3lLc8uXw0eJfUwvdwjTw&usqp=CAU';
  const [dateTime, setDateTime] = useState({ date: '', time: '' });


  const currentChat = chats.find(c => c.id === currentChatId);

  // New chat handler
  const handleNewChat = () => {
    const newChat = {
      id: chatCounter,
      name: `New chat ${chatCounter}`,
      messages: [ { role: "assistant", content: "Hello, Yash" } ]
    };
    setChats([newChat, ...chats]);
    setCurrentChatId(chatCounter);
    setChatCounter(chatCounter + 1);
  };

  // Load recent chat
  const handleLoadChat = (id) => {
    if (editingChatId === id) return;
    setCurrentChatId(id);
  };

  // Update messages in current chat
  const handleUpdateMessages = (messages) => {
    setChats(chats => chats.map(chat =>
      chat.id === currentChatId ? { ...chat, messages } : chat
    ));
  };

  const handleStartEditing = (chat) => {
    setEditingChatId(chat.id);
    setEditingChatName(chat.name);
  };

  const handleCancelEditing = () => {
    setEditingChatId(null);
    setEditingChatName("");
  };

  const handleFinishEditing = () => {
    if (editingChatName.trim()) {
      setChats(chats.map(chat =>
        chat.id === editingChatId ? { ...chat, name: editingChatName.trim() } : chat
      ));
    }
    handleCancelEditing();
  };

  useEffect(() => {
    function updateDateTime() {
      const now = new Date();
      const date = now.toLocaleDateString('en-GB'); // DD/MM/YYYY
      const time = now.toLocaleTimeString('en-GB', { hour12: false }); // HH:MM:SS
      setDateTime({ date, time });
    }
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className={`sidebar${sidebarOpen ? "" : " collapsed"}`}>
        <div className="sidebar-top">
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <FaBars />
          </button>
          {sidebarOpen && (
            <>
              <div className="sidebar-header">
                <img src="https://thumbs.dreamstime.com/b/chat-bot-icon-virtual-assistant-automation-flat-line-color-style-363583472.jpg" alt="Chatbot Logo" className="logo" />
                <h1>GotiLo</h1>
              </div>
              <button className="sidebar-newchat" onClick={handleNewChat}>
                <FaPlus /> New chat
              </button>
              <div className="sidebar-recent">
                <div className="sidebar-recent-title">Recent</div>
                <ul>
                  {chats.map((chat) => (
                    <li
                      key={chat.id}
                      className={chat.id === currentChatId ? "selected" : ""}
                      onClick={() => handleLoadChat(chat.id)}
                      onDoubleClick={() => handleStartEditing(chat)}
                    >
                      {editingChatId === chat.id ? (
                        <input
                          type="text"
                          value={editingChatName}
                          onChange={(e) => setEditingChatName(e.target.value)}
                          onBlur={handleFinishEditing}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleFinishEditing();
                            if (e.key === 'Escape') handleCancelEditing();
                          }}
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <>
                          {chat.name}
                          <button className="edit-btn" onClick={(e) => {
                            e.stopPropagation();
                            handleStartEditing(chat);
                          }}>
                            <FaPencilAlt />
                          </button>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
          <div className="sidebar-bottom">
            <button className="sidebar-settings">
              <FaCog />
              {sidebarOpen && <span>Settings and help</span>}
            </button>
          </div>
        </div>
      </aside>
      {/* Main Content */}
      <main className="main-content">
        <header className="main-header">
          <div className="header-left">
            <span className="header-title">GotiLo</span>
            <div className="model-selector" style={{ position: 'relative' }}>
              <button
                className="model-btn"
                onClick={() => setModelDropdown((open) => !open)}
                tabIndex={0}
              >
                {'Gemini 1.5 Flash'} <span className="model-caret">▼</span>
              </button>
              {modelDropdown && (
                <ul className="model-dropdown">
                  {models.map((m) => (
                    <li
                      key={m}
                      className={m === model ? "selected" : ""}
                      onClick={() => {
                        setModel(m);
                        setModelDropdown(false);
                      }}
                    >
                      {'Gemini 1.5 Flash'}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className="header-right">
            <div className="live-datetime">
              <span className="live-date">{dateTime.date}</span>
              <span className="live-time">{dateTime.time}</span>
            </div>
            {/* <button className="upgrade-btn">✨ Upgrade</button> */}
            <span className="profile-btn">
              <img src={userAvatar} alt="User" className="header-user-avatar" />
            </span>
          </div>
        </header>
        <section className="chat-section">
          <Chat
            model={model}
            messages={currentChat.messages}
            onUpdateMessages={handleUpdateMessages}
          />
        </section>
      </main>
    </div>
  );
}

export default App; 