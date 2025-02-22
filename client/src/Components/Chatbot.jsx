import React, { useState, useEffect } from "react";
import { CuboidIcon as Cube, Link, Play, RepeatIcon as ArrowRepeat, Newspaper, Share2, Moon, Sun, X } from "lucide-react";
import {useNavigate} from 'react-router-dom';



export default function Chatbot() {

  const navigate = useNavigate();

  const [isTyping, setIsTyping] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([
    {
      text: "Hi, I'm Medi~ Ask me anything. I'm here to help! 😊",
      sender: "bot"
    }
  ]);

  const [chatHistory, setChatHistory] = useState([
    { id: 1, title: "How to use React hooks", date: "Feb 20, 2025", preview: "I explained the basics of useState and useEffect..." },
    { id: 2, title: "JavaScript array methods", date: "Feb 18, 2025", preview: "We discussed map, filter, reduce..." },
    { id: 3, title: "CSS Grid tutorial", date: "Feb 15, 2025", preview: "I showed how to create responsive layouts..." },
    { id: 4, title: "Coding best practices", date: "Feb 12, 2025", preview: "We talked about code organization..." },
    { id: 5, title: "Python vs JavaScript", date: "Feb 10, 2025", preview: "I compared the syntax and use cases..." }
  ]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const handleRefreshChat = () => {
    setMessages([{
      text: "Hi, I'm Medi~ Ask me anything. I'm here to help! 😊",
      sender: "bot"
    }]);
    setInputValue("");
    setError(null);
  };

  const handleToggleChatHistory = () => {
    setShowChatHistory(!showChatHistory);
  };

  const handleShareChat = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Chat link copied to clipboard!");
  };

  const handleCopyChatLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Chat link copied!");
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = { text: inputValue, sender: "user" };
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://127.0.0.1:5000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const botMessage = {
        text: data.response,
        sender: "bot"
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      setError("Failed to get response. Please try again.");
      console.error("Chat API Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const MessageBubble = ({ message }) => (
    <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[80%] rounded-lg p-3 ${
        message.sender === 'user'
          ? 'bg-blue-500 text-white'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
      }`}>
        {message.sender === 'bot' && (
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full mb-2 flex items-center justify-center">
            <span className="text-sm">M</span>
          </div>
        )}
        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
      </div>
    </div>
  );

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

  const handleLogin = () =>{
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex">
      {/* Main Sidebar */}
      <div className="w-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-r border-gray-100 dark:border-gray-800 flex flex-col items-center py-4 space-y-6 z-20">
        <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center text-white dark:text-black text-sm font-bold">
          M
        </div>
        <div className="space-y-6">
          <button onClick={handleRefreshChat} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <ArrowRepeat className="w-5 h-5 text-gray-500 dark:text-gray-400 ml-3" />
          </button>
          <button
            onClick={handleToggleChatHistory}
            className={`p-2 ${showChatHistory ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-800'} rounded-lg transition-colors`}
          >
            <Newspaper className={`w-5 h-5 ml-3 ${showChatHistory ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'}`} />
          </button>
          <button onClick={handleShareChat} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <Share2 className="w-5 h-5 text-gray-500 dark:text-gray-400 ml-3" />
          </button>
        </div>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          ) : (
            <Moon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          )}
        </button>
        <button className="mt-auto p-2 bg-gray-200 dark:bg-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300" onClick={handleLogin}>
          Login
        </button>
      </div>

      {/* Chat History Sidebar */}
      {showChatHistory && (
        <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-screen absolute left-16 z-10">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h2 className="font-medium text-gray-800 dark:text-gray-200">Recent Chats</h2>
            <button onClick={handleToggleChatHistory} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
              <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {chatHistory.map(chat => (
              <div
                key={chat.id}
                onClick={() => loadChat(chat.id)}
                className="p-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium text-sm text-gray-800 dark:text-gray-200 truncate">{chat.title}</h3>
                  <span className="text-xs text-gray-500">{chat.date}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{chat.preview}</p>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-gray-200 dark:border-gray-700">
            <button className="w-full py-2 px-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 transition-colors">
              View All Chats
            </button>
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col h-screen transition-all ${showChatHistory ? 'ml-64' : 'ml-0'}`}>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto space-y-4 p-4">
            {messages.map((message, index) => (
              <MessageBubble key={index} message={message} />
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="flex justify-center">
                <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg p-3 text-sm">
                  {error}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t dark:border-gray-700 bg-white dark:bg-gray-900 px-4 pb-7 pt-2">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <div className={`absolute left-8 transition-all duration-500 ease-bounce ${
                isTyping || inputValue ? "-top-28" : "-top-14"
              }`}>
                <div className="relative w-20 h-20 ml-150">
                  <div className="absolute inset-0 scale-150 bg-gradient-radial from-yellow-200/50 to-transparent dark:from-yellow-900/30 rounded-full blur-xl"></div>
                  <div className="absolute inset-0 scale-125 bg-gradient-radial from-white to-transparent dark:from-white/10 rounded-full blur-md"></div>
                  <div className="relative w-20 h-20 bg-white dark:bg-gray-200 rounded-full shadow-lg flex items-center justify-center">
                    <div className="absolute top-7 left-4 w-3 h-3 bg-red-900 rounded-full">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full"></div>
                    </div>
                    <div className="absolute top-7 right-4 w-3 h-3 bg-red-900 rounded-full">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full"></div>
                    </div>
                    <div className="absolute top-11 left-1/2 -translate-x-1/2 w-6 h-3">
                      <svg viewBox="0 0 24 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M4 2C4 2 8 8 12 8C16 8 20 2 20 2"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          className="text-pink-400"
                        />
                      </svg>
                    </div>
                    <div className="absolute -top-6 left-3 w-5 h-10 bg-pink-200 dark:bg-pink-300 rounded-full transform -rotate-12"></div>
                    <div className="absolute -top-6 right-3 w-5 h-10 bg-pink-200 dark:bg-pink-300 rounded-full transform rotate-12"></div>
                  </div>
                </div>
              </div>

              <div className="mt-2 border dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-800">
                <div className="flex items-center p-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                    <span>Medi</span>
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                      <span className="text-gray-500 dark:text-gray-400">Online</span>
                    </div>
                  </div>
                </div>
                <div className="px-4 pb-4">
                  <input
                    type="text"
                    placeholder="Ask Medi..."
                    className="w-full p-2 outline-none text-gray-700 dark:text-gray-200 bg-transparent"
                    onFocus={() => setIsTyping(true)}
                    onBlur={() => setIsTyping(false)}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    disabled={isLoading}
                  />
                </div>
                <div className="border-t dark:border-gray-700 flex justify-end p-2 space-x-2">
                  <button onClick={() => alert("Feature coming soon!")} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <Cube className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </button>
                  <button onClick={handleCopyChatLink} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <Link className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </button>
                  <button onClick={handleSendMessage} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <Play className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}