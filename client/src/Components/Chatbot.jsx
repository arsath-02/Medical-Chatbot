import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import Sidebar from "./Sidebar";
import ChatHistory from "./ChatHistory";
import '../styles.css';
import { v4 as uuidv4 } from "uuid";
import { useContext } from "react";
import { ThemeContext } from "./ThemeContext";
import { TbReportAnalytics } from "react-icons/tb";

export default function Chatbot() {
  const navigate = useNavigate();
  const {isDarkMode} = useContext(ThemeContext);
  const [inputValue, setInputValue] = useState("");
  const name = localStorage.getItem("Name") || "User";
  // Start with an empty messages array
  const [messages, setMessages] = useState([]);

  const [showChatHistory, setShowChatHistory] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sessionId, setSessionId] = useState("");
  const [currentSessionTitle, setCurrentSessionTitle] = useState("New Chat");
  const [isFirstMessageSent, setIsFirstMessageSent] = useState(false);

  useEffect(() => {
    const storedMessages = JSON.parse(localStorage.getItem("chatMessages"));
    if (storedMessages && storedMessages.length > 0) {
      setMessages(storedMessages);
      setIsFirstMessageSent(true);
    } else {
      // Start with empty messages for new users
      setMessages([]);
      localStorage.setItem("chatMessages", JSON.stringify([]));
    }
  }, []);  // ✅ Runs only once when component mounts

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

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userId = localStorage.getItem("Email");
    if (!userId) {
      setError("User not authenticated. Please log in again.");
      navigate('/login');
      return;
    }

    // Add the welcome message if this is the first message in the conversation
    if (!isFirstMessageSent) {
      const welcomeMessage = { text: `Hi ${name}, I am Dr.Chat 😊`, sender: "bot" };
      setMessages(prevMessages => [...prevMessages, welcomeMessage]);
      setIsFirstMessageSent(true);
    }

    const userMessage = { text: inputValue, sender: "user" };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputValue("");
    setIsLoading(true);
    setError(null);

    try {
      let currentTitle = currentSessionTitle;
      if (currentSessionTitle === "New Chat" && messages.length <= 1) {
        currentTitle = inputValue.length > 30 ? inputValue.substring(0, 30) + "..." : inputValue;
        setCurrentSessionTitle(currentTitle);
        localStorage.setItem("chatSessionTitle", currentTitle);
      }

      const response = await fetch("http://127.0.0.1:8000/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          message: inputValue,
          sessionId,
          title: currentTitle
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const botMessage = { text: data.response, sender: "bot" };

      setMessages(prevMessages => {
        const updatedMessages = [...prevMessages, botMessage];
        localStorage.setItem("chatMessages", JSON.stringify(updatedMessages));
        return updatedMessages;
      });

    } catch (err) {
      setError("Failed to get response. Please try again.");
      console.error("Chat API Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to start a new chat
  const handleRefreshChat = () => {
    const newSessionId = uuidv4();
    setSessionId(newSessionId);
    localStorage.setItem("chatSessionId", newSessionId);

    setMessages([]);
    localStorage.setItem("chatMessages", JSON.stringify([]));

    setCurrentSessionTitle("New Chat");
    localStorage.setItem("chatSessionTitle", "New Chat");

    setIsFirstMessageSent(false);

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
      `${msg.sender === 'user' ? name : 'Dr.Chat'}: ${msg.text}`
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
        // If no messages, initialize with empty array but set isFirstMessageSent to false
        setMessages([]);
        setIsFirstMessageSent(false);
      } else {
        setMessages(formattedMessages);
        setIsFirstMessageSent(true);
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

  const handleReport = async () => {
    const formattedMessages = messages
      .map(msg => `${msg.sender}: ${msg.text}`)
      .join('\n');
    console.log("Formatted messages:", formattedMessages);
    try {
      const response = await fetch("http://localhost:8000/api/chatreport", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: formattedMessages // ✅ Send it as a string
        })
      });

      const data = await response.json();
      console.log("Response from API:", data);
    } catch (error) {
      console.error("Error:", error);
    }
  };



  return (
    <div className={`min-h-screen italic flex ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"}`}>
      <Sidebar
        handleRefreshChat={handleRefreshChat}
        handleToggleChatHistory={handleToggleChatHistory}
        handleShareChat={handleShareChat}
        isDarkMode={isDarkMode}
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
          isDarkMode={isDarkMode}
          handleRefreshChat={handleRefreshChat}
        />
      )}

      <div className={`flex-1 flex flex-col h-screen ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"}`}>
      <div className={`border-b p-3 flex justify-between items-center ${isDarkMode ? "border-gray-700 bg-gray-800 text-gray-200" : "border-gray-200 bg-gray-50 text-gray-800"}`}>
  <h2 className="font-medium w-4/5 text-center">{currentSessionTitle || "New Chat"}</h2>
  <TbReportAnalytics onClick={handleReport} />
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