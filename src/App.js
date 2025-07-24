import React, { useState, useEffect } from "react";
import Chat from "./Chat";
import { FaBars, FaCog, FaPlus, FaUserCircle, FaPencilAlt } from "react-icons/fa";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
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

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth <= 768;

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw", overflow: "hidden", fontFamily: "Arial, sans-serif" }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? (isMobile ? "70%" : "260px") : "60px",
        backgroundColor: "#f5f5f5",
        borderRight: "1px solid #ccc",
        transition: "all 0.3s",
        display: "flex",
        flexDirection: "column"
      }}>
        <div style={{ padding: "10px", display: "flex", flexDirection: "column", height: "100%" }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "none", border: "none", fontSize: "1.5rem", marginBottom: "10px", cursor: "pointer", alignSelf: "flex-end" }}>
            <FaBars />
          </button>

          {sidebarOpen && (
            <>
              <div style={{ display: "flex", alignItems: "center", padding: "10px" }}>
                <img src="https://thumbs.dreamstime.com/b/chat-bot-icon-virtual-assistant-automation-flat-line-color-style-363583472.jpg" alt="Logo" style={{ width: 40, height: 40, marginRight: 10 }} />
                <h1 style={{ fontSize: "1.2rem" }}>GotiLo</h1>
              </div>

              <button onClick={handleNewChat} style={{ backgroundColor: "#007bff", color: "white", padding: "10px", margin: "10px", borderRadius: "5px", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }}>
                <FaPlus style={{ marginRight: 8 }} /> New chat
              </button>

              <div style={{ padding: "10px" }}>
                <div style={{ fontWeight: "bold", marginBottom: 8 }}>Recent</div>
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {chats.map((chat) => (
                    <li
                      key={chat.id}
                      onClick={() => handleLoadChat(chat.id)}
                      onDoubleClick={() => handleStartEditing(chat)}
                      style={{
                        padding: "8px",
                        backgroundColor: chat.id === currentChatId ? "#e0e0e0" : "transparent",
                        borderRadius: "4px",
                        marginBottom: "5px",
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
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
            </>
          )}

          <div style={{ marginTop: "auto", padding: "10px" }}>
            <button style={{ background: "none", border: "none", display: "flex", alignItems: "center", cursor: "pointer", color: "#555" }}>
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
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <span style={{ fontSize: "1.3rem", fontWeight: "bold" }}>GotiLo</span>
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
                  backgroundColor: "#fff",
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
                      backgroundColor: m === model ? "#e0e0e0" : "transparent"
                    }}>
                      Gemini 1.5 Flash
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div>
              <span>{dateTime.date}</span>{" "}
              <span style={{ fontWeight: "bold" }}>{dateTime.time}</span>
            </div>
            <img src={userAvatar} alt="User" style={{ width: 32, height: 32, borderRadius: "50%" }} />
          </div>
        </header>

        <section style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
          <Chat
            model={model}
            messages={currentChat?.messages || []}
            onUpdateMessages={handleUpdateMessages}
          />
        </section>
      </main>
    </div>
  );
}

export default App;
