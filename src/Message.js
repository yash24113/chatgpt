import React, { useState } from 'react';
import './styles.css';
import { FaCopy, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';

const userAvatar = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQoYalG0iZwdwwSFMhNL4aDADjcSJFcuo31Y9OY6saF8ZG5dq3lLc8uXw0eJfUwvdwjTw&usqp=CAU';
const assistantAvatar = 'https://thumbs.dreamstime.com/b/chat-bot-icon-virtual-assistant-automation-flat-line-color-style-363583472.jpg';

export default function Message({ text, sender, isTyping, onEdit, idx }) {
  const avatarSrc = sender === 'user' ? userAvatar : assistantAvatar;
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(text);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const handleEdit = () => {
    setEditing(true);
    setEditValue(text);
  };

  const handleEditSave = () => {
    if (onEdit && editValue.trim()) {
      onEdit(idx, editValue.trim());
      setEditing(false);
    }
  };

  const handleEditCancel = () => {
    setEditing(false);
    setEditValue(text);
  };

  if (sender === 'user') {
    return (
      <div className={`message-row user`}>
        <span className={`avatar avatar-user`}>
          <img
            src={avatarSrc}
            alt={sender}
            className="avatar-img"
          />
        </span>
        <div className="message message-user">
          {editing ? (
            <>
              <input
                className="edit-message-input"
                value={editValue}
                onChange={e => setEditValue(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleEditSave();
                  if (e.key === 'Escape') handleEditCancel();
                }}
                autoFocus
              />
              <button className="msg-action-btn" onClick={handleEditSave} title="Save"><FaCheck /></button>
              <button className="msg-action-btn" onClick={handleEditCancel} title="Cancel"><FaTimes /></button>
            </>
          ) : (
            <>
              {text}
              <span className="msg-actions">
                <button className="msg-action-btn" onClick={handleCopy} title="Copy"><FaCopy /></button>
                <button className="msg-action-btn" onClick={handleEdit} title="Edit"><FaEdit /></button>
                {copied && <span className="msg-copied">Copied!</span>}
              </span>
            </>
          )}
        </div>
      </div>
    );
  }
  return (
    <div className={`message-row assistant`}>
      <span className={`avatar avatar-assistant`}>
        <img
          src={avatarSrc}
          alt={sender}
          className="avatar-img"
        />
      </span>
      {isTyping ? (
        <div className="typing-indicator">
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
        </div>
      ) : (
        <div className={`message message-assistant`}>
          {text}
          <span className="msg-actions">
            <button className="msg-action-btn" onClick={handleCopy} title="Copy"><FaCopy /></button>
            {copied && <span className="msg-copied">Copied!</span>}
          </span>
        </div>
      )}
    </div>
  );
} 