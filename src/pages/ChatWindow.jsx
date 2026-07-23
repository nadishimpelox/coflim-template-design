import React, { useState } from 'react';
import { MessageSquare, Plus, Settings, LogOut, Send, Bot, User, Paperclip } from 'lucide-react';
import './ChatWindow.css';

const ChatWindow = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! How can I help you today?' }
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    const newMessages = [...messages, { role: 'user', content: inputValue }];
    setMessages(newMessages);
    setInputValue('');
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', content: 'I am a simulated AI. I received your message: ' + inputValue }]);
    }, 1000);
  };

  return (
    <div className="chat-layout">
      {/* Sidebar */}
      <aside className="chat-sidebar">
        <button className="new-chat-btn">
          <Plus size={16} /> New Chat
        </button>
        
        <div className="chat-history">
          <div className="history-section">
            <h3 className="history-title">Today</h3>
            <div className="history-item active">
              <MessageSquare size={16} />
              <span>Getting Started</span>
            </div>
          </div>
          <div className="history-section">
            <h3 className="history-title">Previous 7 Days</h3>
            <div className="history-item">
              <MessageSquare size={16} />
              <span>Video Analysis Script</span>
            </div>
            <div className="history-item">
              <MessageSquare size={16} />
              <span>Platform Integration</span>
            </div>
          </div>
        </div>
        
        <div className="sidebar-footer">
          <div className="footer-item">
            <Settings size={16} />
            <span>Settings</span>
          </div>
          <div className="footer-item">
            <LogOut size={16} />
            <span>Log out</span>
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="chat-main">
        <div className="chat-messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`message-row ${msg.role}`}>
              <div className="message-avatar">
                {msg.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
              </div>
              <div className="message-content">
                {msg.content}
              </div>
            </div>
          ))}
        </div>
        
        <div className="chat-input-container">
          <div className="chat-input-wrapper">
            <button className="attach-btn"><Paperclip size={18} /></button>
            <input 
              type="text" 
              className="chat-input" 
              placeholder="Message ChatBuilder Pro..." 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button 
              className={`send-btn ${inputValue.trim() ? 'active' : ''}`} 
              onClick={handleSendMessage}
            >
              <Send size={18} />
            </button>
          </div>
          <div className="chat-disclaimer">
            AI can make mistakes. Consider verifying important information.
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatWindow;
