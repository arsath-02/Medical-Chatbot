import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import Sidebar from "./Sidebar";
import ChatHistory from "./ChatHistory";
import '../styles.css'; // Import the CSS file

import { getAuth, onAuthStateChanged } from "firebase/auth"; 

export default function Chatbot() {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([
    { text: "Hi, I'm Medi~ Ask me anything! 😊", sender: "bot" }
  ]);
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);
// Import Firebase auth

const handleSendMessage = async () => {
  if (!inputValue.trim() || isLoading) return;

  // Get userId from localStorage (set this when the user logs in via Firebase)
  const userId = localStorage.getItem("userId"); 
  if (!userId) {
    console.error("User not authenticated");
    setError("User not authenticated. Please log in again.");
    return;
  }

  const userMessage = { text: inputValue, sender: "user" };
  setMessages(prev => [...prev, userMessage]);
  setInputValue("");
  setIsLoading(true);
  setError(null);

  try {
    // Send request to Node.js backend
    const response = await fetch('http://127.0.0.1:8000/api/chatbot', {  
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, message: inputValue })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const botMessage = { text: data.response, sender: "bot" };

    setMessages(prev => [...prev, botMessage]);
  } catch (err) {
    setError("Failed to get response. Please try again.");
    console.error("Chat API Error:", err);
  } finally {
    setIsLoading(false);
  }
};



  const handleRefreshChat = () => {
    setMessages([{ text: "Hi, I'm Medi~ Ask me anything! 😊", sender: "bot" }]);
  };

  const handleToggleChatHistory = () => {
    setShowChatHistory(!showChatHistory);
  };

  const handleShareChat = () => {
    alert("Sharing feature coming soon!");
  };

  const loadChat = async (chatId) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/chats/${chatId}`);
      if (!response.ok) throw new Error('Failed to load chat');
      const data = await response.json();
      setMessages(data.messages);
    } catch (err) {
      setError("Failed to load chat history");
      console.error("Load Chat Error:", err);
    } finally {
      setIsLoading(false);
      setShowChatHistory(false);
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };
  const handleVoice=()=>{
  navigate("/voice");

  }
const handlechatbot=()=>{
  navigate("/");
}

  return (
    <div className="min-h-screen flex bg-white dark:bg-gray-900">
      <Sidebar 
        handleRefreshChat={handleRefreshChat} 
        handleToggleChatHistory={handleToggleChatHistory} 
        handleShareChat={handleShareChat} 
        isDarkMode={isDarkMode} 
        setIsDarkMode={setIsDarkMode} 
        handleLogin={handleLogin}
        showChatHistory={showChatHistory}
        handleVoice={handleVoice}
        handlechatbot={handlechatbot}
      />
      {showChatHistory && <ChatHistory chatHistory={chatHistory} loadChat={loadChat} handleToggleChatHistory={handleToggleChatHistory} />}
      <div className="flex-1 flex flex-col h-screen">
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <ChatMessages messages={messages} isLoading={isLoading} error={error} />
        </div>
        <ChatInput handleSendMessage={handleSendMessage} inputValue={inputValue} setInputValue={setInputValue} isLoading={isLoading} />
      </div>
    </div>
  );
}