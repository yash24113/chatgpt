import React, { useState, useEffect, useRef } from "react";
import Chat from "./Chat";
import Login from "./Login";
import "./App.css";
import "./AppResponsive.css";
import { FaBars, FaCog, FaPlus, FaPencilAlt, FaUserCircle, FaSignOutAlt, FaComments, FaTimes } from "react-icons/fa";

function App() {
  // ...existing state and handlers...
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('token'));
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const profileDropdownRef = useRef();

  useEffect(() => {
    function handleClickOutside(e) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target)) {
        setShowProfileDropdown(false);
      }
    }
    if (showProfileDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileDropdown]);

  const handleLogout = async () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setShowLogoutConfirm(false);
    setShowProfileDropdown(false);
    try {
      await fetch('http://localhost:5000/api/logout', { method: 'POST' });
    } catch (e) {}
  }

  // Handle login success
  const [userEmail, setUserEmail] = useState("");
  const handleLoginSuccess = (token, email) => {
    localStorage.setItem('token', token);
    setIsLoggedIn(true);
    setUserEmail(email);
  }
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 900);
  const [mobileSidebar, setMobileSidebar] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 900) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [model, setModel] = useState("gemini-1.5-flash");
  const [modelDropdown, setModelDropdown] = useState(false);
  const [chats, setChats] = useState([
    { id: 1, name: "New chat", messages: [{ role: "assistant", content: "Hello, Yash" }] }
  ]);
  const [currentChatId, setCurrentChatId] = useState(1);
  const [chatCounter, setChatCounter] = useState(2);
  const models = ["gemini-1.5-flash"];
  const [editingChatId, setEditingChatId] = useState(null);
  const [editingChatName, setEditingChatName] = useState("");
  const userAvatar = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQoYalG0iZwdwwSFMhNL4aDADjcSJFcuo31Y9OY6saF8ZG5dq3lLc8uXw0eJfUwvdwjTw&usqp=CAU';
  const [dateTime, setDateTime] = useState({ date: '', time: '' });

  const currentChat = chats.find(c => c.id === currentChatId);

  const handleNewChat = () => {
    const newChat = {
      id: chatCounter,
      name: `New chat ${chatCounter}`,
      messages: [{ role: "assistant", content: "Hello, Yash" }]
    };
    setChats([newChat, ...chats]);
    setCurrentChatId(chatCounter);
    setChatCounter(chatCounter + 1);
  };

  const handleLoadChat = (id) => {
    if (editingChatId === id) return;
    setCurrentChatId(id);
  };

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
      const date = now.toLocaleDateString('en-GB');
      const time = now.toLocaleTimeString('en-GB', { hour12: false });
      setDateTime({ date, time });
    }
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

<<<<<<< HEAD
  if (!isLoggedIn) {
    return <Login onLoginSuccess={(token) => handleLoginSuccess(token, userEmail)} setUserEmail={setUserEmail} />;
  }
=======
  // if (!isLoggedIn) {
  //   return <Login onLoginSuccess={handleLoginSuccess} />;
  // }
>>>>>>> d2db314cea090d88a3eb29f6a39e1e45ef30bd42

  return (
    <div className="app-root" style={{ display: "flex", height: "100vh", width: "100vw", overflow: "hidden", fontFamily: "Arial, sans-serif" }}>
      {/* Sidebar */}
      <aside className="sidebar" style={{
        width: sidebarOpen ? "260px" : "60px",
        backgroundColor: "#f5f5f5",
        borderRight: "1px solid #ccc",
        transition: "all 0.3s",
        display: "flex",
        flexDirection: "column"
      }}>
        <div className="sidebar-content" style={{ padding: "10px", display: "flex", flexDirection: "column", height: "100%" }}>
          {/* Hamburger, logo, + for mobile */}
          <button className="sidebar-hamburger" onClick={() => setMobileSidebar(!mobileSidebar)} style={{ background: "none", border: "none", fontSize: "1.8rem", marginBottom: "10px", cursor: "pointer", alignSelf: "flex-start", display: window.innerWidth <= 900 ? 'block' : 'none' }}>
            <FaBars />
          </button>
          {/* <img className="sidebar-logo" src="https://thumbs.dreamstime.com/b/chat-bot-icon-virtual-assistant-automation-flat-line-color-style-363583472.jpg" alt="Logo" style={{ width: 40, height: 40, marginRight: 10 }} />
          <h1 className="sidebar-title" style={{ fontSize: "1.2rem",color:"#007bff", marginRight: 12 }}>GotiLo</h1>
          */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '10px 0 10px 0', paddingLeft: 2 }}>
            <img className="sidebar-logo" src="https://thumbs.dreamstime.com/b/chat-bot-icon-virtual-assistant-automation-flat-line-color-style-363583472.jpg" alt="Logo" style={{ width: 36, height: 36, marginRight: 7 }} />
            <span style={{ fontWeight: 600, fontSize: 20, color: '#007bff', letterSpacing: 0.5 }}>GotiLo</span>
          </div>

          {/* Mobile sidebar overlay */}
          {mobileSidebar && window.innerWidth <= 900 && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'rgba(0,0,0,0.18)',
                zIndex: 2000,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
              }}
              onClick={() => setMobileSidebar(false)}
            >
              <div
                style={{
                  background: '#fff',
                  width: 270,
                  height: '100vh',
                  boxShadow: '2px 0 16px rgba(0,0,0,0.13)',
                  borderRadius: '0 16px 16px 0',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0,
                  position: 'relative',
                }}
                onClick={e => e.stopPropagation()}
              >
                {/* Close Icon */}
                <button onClick={() => setMobileSidebar(false)} style={{ position: 'absolute', top: 13, right: 14, background: 'none', border: 'none', fontSize: 25, color: '#555', zIndex: 1 }} title="Close">
                  <FaTimes />
                </button>
                {/* User Icon */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 0 12px 0', gap: 8 }}>
                  <FaUserCircle size={48} color="#007bff" style={{ marginBottom: 2 }} />
                  <span style={{ fontWeight: 600, fontSize: 17, color: '#007bff', marginTop: 2 }}>GotiLo</span>
                </div>
                {/* New Chat Icon */}
                <button onClick={() => { handleNewChat(); setMobileSidebar(false); }} style={{ background: '#007bff', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 0', fontWeight: 600, fontSize: 15, margin: '0 20px 8px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }} title="New chat">
                  <FaPlus size={20} />
                </button>
                {/* Recent Chats Icon */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '0 20px 4px 20px', color: '#555', fontWeight: 600, fontSize: 15 }}>
                  <FaComments size={18} />
                  <span>Recent</span>
                </div>
                <div style={{ padding: '0 20px 0 20px', width: '100%' }}>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, maxHeight: '35vh', overflowY: 'auto' }}>
                    {chats.map((chat) => (
                      <li
                        key={chat.id}
                        onClick={() => { handleLoadChat(chat.id); setMobileSidebar(false); }}
                        style={{
                          padding: "8px 0",
                          backgroundColor: chat.id === currentChatId ? "#e0e0e0" : "transparent",
                          borderRadius: "4px",
                          marginBottom: "2px",
                          cursor: "pointer",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          color: '#555'
                        }}
                      >
                        <span style={{ flex: 1 }}>{chat.name}</span>
                        <button onClick={e => { e.stopPropagation(); handleStartEditing(chat); }} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer' }} title="Edit">
                          <FaPencilAlt />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Logout Icon */}
                <button
                  onClick={() => { setShowLogoutConfirm(true); setMobileSidebar(false); }}
                  style={{ background: '#f5f5f5', color: '#d00', border: 'none', borderRadius: 10, padding: '12px 0', fontWeight: 600, fontSize: 15, margin: '22px 20px 18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
                  title="Logout"
                >
                  <FaSignOutAlt size={20} />
                </button>
              </div>
            </div>
          )}
          {/* Drawer for mobile recent chats */}
          <div className="sidebar-recent" style={{ padding: "10px", display: (window.innerWidth > 900 || mobileSidebar) ? 'block' : 'none' }}>
            <div style={{ fontWeight: 600, color: '#555', margin: '30px 0 10px 0', fontSize: 18 }}>Recent</div>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {chats.map((chat) => (
                <li
                  key={chat.id}
                  onClick={() => { handleLoadChat(chat.id); setMobileSidebar(false); }}
                  onDoubleClick={() => handleStartEditing(chat)}
                  style={{
                    padding: "8px",
                    backgroundColor: chat.id === currentChatId ? "#e0e0e0" : "transparent",
                    borderRadius: "4px",
                    marginBottom: "5px",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    color: '#555'
                  }}
                >
                  {editingChatId === chat.id ? (
                    <input
                      value={editingChatName}
                      onChange={(e) => setEditingChatName(e.target.value)}
                      onBlur={handleFinishEditing}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleFinishEditing();
                        if (e.key === 'Escape') handleCancelEditing();
                      }}
                      autoFocus
                      style={{ flex: 1, marginRight: "5px" }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <>
                      <span style={{ flex: 1 }}>{chat.name}</span>
                      <button onClick={(e) => {
                        e.stopPropagation();
                        handleStartEditing(chat);
                      }} style={{ background: "none", border: "none", cursor: "pointer", color: "#555" }}>
                        <FaPencilAlt />
                      </button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div className="sidebar-settings" style={{ marginTop: "auto", padding: "10px" }}>
            <button style={{ background: "none", border: "none", display: "flex", alignItems: "center", cursor: "pointer", color: "#222" }}>
              <FaCog style={{ marginRight: 6 }} />
              {sidebarOpen && <span>Settings and help</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", backgroundColor: "#fff" }}>
        <header style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 20px",
          backgroundColor: "#f0f0f0",
          borderBottom: "1px solid #ddd"
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <span style={{ fontSize: "1.3rem", fontWeight: "bold", color: '#111', letterSpacing: '0.01em', marginLeft: 8 }}>GotiLo</span>
            <div style={{ position: 'relative' }}>
              <button onClick={() => setModelDropdown(open => !open)} style={{
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                borderRadius: "5px",
                padding: "5px 10px",
                cursor: "pointer"
              }}>
                {model === "gemini-1.5-flash" ? "Gemini 1.5 Flash" : model} <span style={{ fontSize: "0.8rem" }}>▼</span>
              </button>
              {modelDropdown && (
                <ul style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  backgroundColor: "none",
                  listStyle: "none",
                  margin: 0,
                  padding: "5px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  width: "150px",
                  zIndex: 1
                }}>
                  {models.map((m) => (
                    <li key={m} onClick={() => { setModel(m); setModelDropdown(false); }} style={{
                      padding: "5px 10px",
                      cursor: "pointer",
                      color: "black",
                      backgroundColor: m === model ? "#e0e0e0" : "transparent"
                    }}>
                      Gemini 1.5 Flash
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginRight: 4 }}>
              <span className="colorful-date" style={{ fontWeight: 600, letterSpacing: '0.02em', fontSize: '1rem', background: 'linear-gradient(90deg, #ff6ec4, #f9d423)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', textFillColor: 'transparent' }}>{dateTime.date}</span>
              <span className="colorful-time" style={{ fontFamily: 'Roboto Mono, monospace', fontSize: '1.1rem', color: '#4f8cff', fontWeight: 700, letterSpacing: '0.04em', background: 'linear-gradient(90deg, #4f8cff, #f9d423)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', textFillColor: 'transparent' }}>{dateTime.time}</span>
            </div>
            <img
              src={userAvatar}
              alt="User"
              className="header-user-avatar"
              style={{ width: 38, height: 38, borderRadius: '50%', cursor: 'pointer', border: showProfileDropdown ? '2px solid #007bff' : '2px solid #fff', transition: 'border 0.2s' }}
              onClick={() => setShowProfileDropdown((open) => !open)}
            />
            {showProfileDropdown && (
              <div ref={profileDropdownRef} style={{
                position: 'absolute',
                top: 55,
                right: 0,
                background: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.13)',
                borderRadius: 8,
                zIndex: 100,
                minWidth: 140,
                padding: 0
              }}>
                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#222',
                    width: '100%',
                    textAlign: 'left',
                    padding: '12px 22px',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    borderBottom: '1px solid #eee',
                    borderRadius: '8px 8px 0 0'
                  }}
                  onClick={() => { setShowLogoutConfirm(true); setShowProfileDropdown(false); }}
                >
                  Logout
                </button>
              </div>
            )}
            {showLogoutConfirm && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'rgba(0,0,0,0.22)',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{ background: '#fff', borderRadius: 10, padding: 32, minWidth: 320, boxShadow: '0 2px 24px rgba(0,0,0,0.13)', textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 14 }}>Confirm Logout</div>
                  <div style={{ fontSize: 16, marginBottom: 24 }}>Are you sure you want to logout?</div>
                  <div style={{ display: 'flex', gap: 18, justifyContent: 'center' }}>
                    <button onClick={handleLogout} style={{ background: '#ff2d55', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 28px', fontWeight: 600, cursor: 'pointer', fontSize: '1rem' }}>Logout</button>
                    <button onClick={() => setShowLogoutConfirm(false)} style={{ background: '#e0e0e0', color: '#222', border: 'none', borderRadius: 6, padding: '10px 28px', fontWeight: 600, cursor: 'pointer', fontSize: '1rem' }}>Cancel</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>

        <section style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
          <Chat
            model={model}
            messages={currentChat?.messages || []}
            onUpdateMessages={handleUpdateMessages}
            userEmail={userEmail}
          />
        </section>
      </main>
    </div>
  );
}

export default App;
