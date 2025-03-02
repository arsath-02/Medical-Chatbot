import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import Sidebar from "./Sidebar";
import ChatHistory from "./ChatHistory";
import '../styles.css'; // Import the CSS file
import { v4 as uuidv4 } from "uuid";

export default function Chatbot() {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const name = localStorage.getItem("Name") || "User";
  const [messages, setMessages] = useState([
    { text: "Hi " + name + ", I am MediBot 😊", sender: "bot" }
  ]);
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sessionId, setSessionId] = useState("");
  const [currentSessionTitle, setCurrentSessionTitle] = useState("New Chat");

  // Handle dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Initialize session ID
  useEffect(() => {
    const storedSessionId = localStorage.getItem("chatSessionId");
    if (storedSessionId) {
      setSessionId(storedSessionId);
    } else {
      const newSessionId = uuidv4();
      setSessionId(newSessionId);
      localStorage.setItem("chatSessionId", newSessionId);
    }
  }, []);

  // Fetch chat sessions when component mounts
  useEffect(() => {
    fetchChatSessions();
  }, []);

  // Function to fetch chat sessions from backend
  const fetchChatSessions = async () => {
    const userId = localStorage.getItem("Email");
    if (!userId) {
      console.error("User not authenticated");
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/sessions?userId=${encodeURIComponent(userId)}`);
      if (!response.ok) {
        throw new Error("Failed to fetch sessions");
      }
      const sessions = await response.json();

      // Format sessions for display
      const formattedSessions = sessions.map(session => ({
        id: session.id || session.sessionId,
        title: session.title || `Chat ${new Date(session.timestamp || session.createdAt).toLocaleDateString()}`,
        date: new Date(session.timestamp || session.createdAt).toLocaleDateString(),
        preview: session.preview || "Click to view chat"
      }));

      setChatHistory(formattedSessions);
    } catch (error) {
      console.error("Failed to fetch sessions", error);
      setError("Failed to load chat history. Please try again.");
    }
  };

  // Function to handle sending messages
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userId = localStorage.getItem("Email");
    if (!userId) {
      setError("User not authenticated. Please log in again.");
      navigate('/login');
      return;
    }

    const userMessage = { text: inputValue, sender: "user" };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputValue("");
    setIsLoading(true);
    setError(null);

    try {
      // If this is the first message and we don't have a title yet, use it as title
      let currentTitle = currentSessionTitle;
      if (currentSessionTitle === "New Chat" && messages.length === 1) {
        currentTitle = inputValue.length > 30 ? inputValue.substring(0, 30) + "..." : inputValue;
        setCurrentSessionTitle(currentTitle);
      }

      const response = await fetch("http://127.0.0.1:8000/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          message: inputValue,
          sessionId: sessionId,
          title: currentTitle
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const botMessage = { text: data.response, sender: "bot" };

      setMessages(prevMessages => [...prevMessages, botMessage]);

      // Refresh chat history if this was a new chat
      if (messages.length <= 2) {
        fetchChatSessions();
      }
    } catch (err) {
      setError("Failed to get response. Please try again.");
      console.error("Chat API Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to start a new chat
  const handleRefreshChat = () => {
    // Generate a new session ID
    const newSessionId = uuidv4();
    setSessionId(newSessionId);
    localStorage.setItem("chatSessionId", newSessionId);

    // Reset messages and title
    setMessages([{ text: "Hi " + name + ", I am MediBot 😊", sender: "bot" }]);
    setCurrentSessionTitle("New Chat");

    // Close chat history if open
    if (showChatHistory) {
      setShowChatHistory(false);
    }
  };

  // Function to toggle chat history panel
  const handleToggleChatHistory = () => {
    setShowChatHistory(!showChatHistory);
    if (!showChatHistory) {
      fetchChatSessions();
    }
  };

  // Function to share chat (placeholder)
  const handleShareChat = () => {
    if (messages.length <= 1) {
      alert("Start a conversation first before sharing!");
      return;
    }

    // Create a formatted text version of the chat
    const chatText = messages.map(msg =>
      `${msg.sender === 'user' ? name : 'MediBot'}: ${msg.text}`
    ).join('\n\n');

    // Use the Web Share API if available
    if (navigator.share) {
      navigator.share({
        title: 'My MediBot Conversation',
        text: chatText
      }).catch(err => {
        console.error('Error sharing:', err);
        alert("Couldn't share the chat. Copy feature coming soon!");
      });
    } else {
      alert("Sharing feature coming soon!");
    }
  };

  const loadChat = async (selectedSessionId) => {
    try {
      setIsLoading(true);
      const userId = localStorage.getItem("Email");

      const response = await fetch(`http://127.0.0.1:8000/api/chat/${selectedSessionId}?userId=${encodeURIComponent(userId)}`);
      if (!response.ok) throw new Error("Failed to fetch chat history");

      const chatData = await response.json();

      // Update the session ID
      setSessionId(selectedSessionId);
      localStorage.setItem("chatSessionId", selectedSessionId);

      // Find the chat in history to get its title
      const selectedChat = chatHistory.find(chat => chat.id === selectedSessionId);
      if (selectedChat) {
        setCurrentSessionTitle(selectedChat.title);
      }

      // Format messages if they're not already in the right format
      const formattedMessages = Array.isArray(chatData.messages)
        ? chatData.messages
        : chatData.map(msg => ({
            text: msg.content || msg.text,
            sender: msg.role === 'user' ? 'user' : 'bot'
          }));

      if (formattedMessages.length === 0) {
        // If no messages, initialize with greeting
        setMessages([{ text: "Hi " + name + ", I am MediBot 😊", sender: "bot" }]);
      } else {
        setMessages(formattedMessages);
      }

      // Close chat history panel
      setShowChatHistory(false);
    } catch (error) {
      console.error("Error loading chat history:", error);
      setError("Failed to load chat. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleVoice = () => {
    navigate("/voice");
  };

  const handleChatbot = () => {
    navigate("/chatbot");
  };

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
        handleChatbot={handleChatbot}
      />
      {showChatHistory && (
        <ChatHistory
          chatHistory={chatHistory}
          loadChat={loadChat}
          handleToggleChatHistory={handleToggleChatHistory}
          currentSessionId={sessionId}
        />
      )}
      <div className="flex-1 flex flex-col h-screen">
        <div className="border-b border-gray-200 dark:border-gray-700 p-3 text-center">
          <h2 className="font-medium text-gray-800 dark:text-gray-200">{currentSessionTitle}</h2>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <ChatMessages messages={messages} isLoading={isLoading} error={error} />
        </div>
        <ChatInput
          handleSendMessage={handleSendMessage}
          inputValue={inputValue}
          setInputValue={setInputValue}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}