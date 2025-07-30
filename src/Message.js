import React, { useState } from 'react';
import { FaCopy, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';

const userAvatar = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQoYalG0iZwdwwSFMhNL4aDADjcSJFcuo31Y9OY6saF8ZG5dq3lLc8uXw0eJfUwvdwjTw&usqp=CAU';
const assistantAvatar = 'https://thumbs.dreamstime.com/b/chat-bot-icon-virtual-assistant-automation-flat-line-color-style-363583472.jpg';

export default function Message({ text, sender, isTyping, onEdit, idx, image }) {
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

  const messageRowStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    padding: '12px',
    gap: '10px',
    width: '100%',
    maxWidth: '100%',
    flexDirection: 'row',
  };

  const messageBoxStyle = {
    background: 'none',
    color: '#111',
    padding: '10px 14px',
    borderRadius: '0',
    maxWidth: 'calc(100% - 60px)',
    wordBreak: 'break-word',
    fontSize: '16px',
    position: 'relative',
    flex: 1,
  };


  const avatarStyle = {
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    objectFit: 'cover',
  };

  const actionsStyle = {
    position: 'absolute',
    top: '5px',
    right: '8px',
    display: 'flex',
    gap: '8px',
  };

  const actionBtnStyle = {
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#333',
  };

  const inputStyle = {
    padding: '6px 10px',
    fontSize: '15px',
    width: 'calc(100% - 80px)',
    borderRadius: '6px',
    border: '1px solid #ccc',
    marginBottom: '6px',
  };

  const typingIndicatorStyle = {
    display: 'flex',
    gap: '5px',
    marginTop: '10px',
    marginLeft: '5px',
  };

  const typingDotStyle = {
    width: '8px',
    height: '8px',
    backgroundColor: '#999',
    borderRadius: '50%',
    animation: 'blink 1.5s infinite ease-in-out',
  };

  return (
    <div
      style={{
        ...messageRowStyle,
        justifyContent: sender === 'user' ? 'flex-end' : 'flex-start',
        flexWrap: 'wrap',
      }}
    >
      {sender === 'assistant' && (
        <img src={avatarSrc} alt={sender} style={avatarStyle} />
      )}
      {isTyping ? (
        <div style={{ ...typingIndicatorStyle }}>
          <div style={typingDotStyle}></div>
          <div style={typingDotStyle}></div>
          <div style={typingDotStyle}></div>
        </div>
      ) : (
        <div style={{ ...messageBoxStyle }}>
          {editing ? (
            <>
              <input
                value={editValue}
                onChange={e => setEditValue(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleEditSave();
                  if (e.key === 'Escape') handleEditCancel();
                }}
                autoFocus
                style={inputStyle}
              />
              <div style={actionsStyle}>
                <button style={actionBtnStyle} onClick={handleEditSave} title="Save"><FaCheck /></button>
                <button style={actionBtnStyle} onClick={handleEditCancel} title="Cancel"><FaTimes /></button>
              </div>
            </>
          ) : (
            <>
              {typeof image === 'string' && image.startsWith('data:') && (
                <img src={image} alt="Pasted" style={{ maxWidth: '220px', maxHeight: '160px', borderRadius: 8, marginBottom: 8, display: 'block' }} />
              )}
              {text}
              <div style={actionsStyle}>
                <button style={actionBtnStyle} onClick={handleCopy} title="Copy"><FaCopy /></button>
                {sender === 'user' && (
                  <button style={actionBtnStyle} onClick={handleEdit} title="Edit"><FaEdit /></button>
                )}
                {copied && <span style={{ fontSize: '12px', color: 'green' }}>Copied!</span>}
              </div>
            </>
          )}
        </div>
      )}
      {sender === 'user' && (
        <img src={avatarSrc} alt={sender} style={avatarStyle} />
      )}
    </div>
  );
}
