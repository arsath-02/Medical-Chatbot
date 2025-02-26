import React, { useState, useEffect, useRef } from "react";
import { RepeatIcon as ArrowRepeat, Newspaper, Share2, Moon, Sun, X } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { IoAccessibilitySharp } from "react-icons/io5";
import { RiMic2Line } from "react-icons/ri";
import video from "../assets/video.mp4";
import { SiChatbot } from "react-icons/si";
export default function Voice() {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [error, setError] = useState(null);
  const [isClicked, setIsClicked] = useState(false);
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef(null);

  const [chatHistory, setChatHistory] = useState([
    { id: 1, title: "How to use React hooks", date: "Feb 20, 2025", preview: "I explained the basics of useState and useEffect..." },
    { id: 2, title: "JavaScript array methods", date: "Feb 18, 2025", preview: "We discussed map, filter, reduce..." },
    { id: 3, title: "CSS Grid tutorial", date: "Feb 15, 2025", preview: "I showed how to create responsive layouts..." },
    { id: 4, title: "Coding best practices", date: "Feb 12, 2025", preview: "We talked about code organization..." },
    { id: 5, title: "Python vs JavaScript", date: "Feb 10, 2025", preview: "I compared the syntax and use cases..." }
  ]);

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const handleMicClick = () => {
    console.log("clicked");
    setIsClicked(!isClicked);
    if (recognition) {
      if (!isListening) {
        recognition.start();
        setIsListening(true);
      } else {
        recognition.stop();
        setIsListening(false);
      }
    } else {
      alert("Speech recognition is not supported in this browser.");
    }
  };

  if (recognition) {
    recognition.onstart = () => {
      console.log("Listening...");
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log("Text:", text);
      console.log("Transcript:", transcript);
      handleSendMessage(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  }

  const handleRefreshChat = () => {
    setMessages([{
      text: "Hi, I'm Medi~ Ask me anything. I'm here to help! 😊",
      sender: "bot"
    }]);
    setInputValue("");
    setError(null);
    setShowVideo(false);
  };

  const handleSendMessage = async (textar) => {
    console.log("Textar:", textar);
    try {
      const response = await fetch('http://127.0.0.1:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: textar
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data.response);

      // Hide any previous video before speaking
      setShowVideo(false);

      const speech = new SpeechSynthesisUtterance(data.response);
      setIsClicked(false);
      setShowVideo(true);
      window.speechSynthesis.speak(speech);

      // When speech ends, show the video
      speech.onend = () => {
        setShowVideo(false);
        // If the video element exists, play it
        if (videoRef.current) {
          videoRef.current.play();
        }
      };

      // Handle video ending
      if (videoRef.current) {
        videoRef.current.onended = () => {
          setShowVideo(false);
        };
      }

    } catch (err) {
      setError("Failed to get response. Please try again.");
      console.error("Chat API Error:", err);
    }
  };

  const handleToggleChatHistory = () => {
    setShowChatHistory(!showChatHistory);
  };

  const handleShareChat = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Chat link copied to clipboard!");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleVoice = () => {
    navigate("/voice");
  };
  const handlechatbot = () => {
    navigate("/chatbot");
  };

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
          <div className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <div className="ml-4">
              <IoAccessibilitySharp color="gray" size={20} onClick={handleVoice} />
            </div>
          </div>
           <div className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                      <div className="ml-4">
                    <SiChatbot color="gray" size={20} onClick={handlechatbot} />
                    </div>
                    </div>
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

      {/* Microphone Button and Video */}
      <div className="flex-1 flex flex-col items-center justify-center rounded-full">
        {/* Video displayed when shown */}
        {showVideo && (
          <div className="mb-8 ml-15">
            <div className="relative w-64 h-64">
              <video
                ref={videoRef}
                className="h-50 w-50 rounded-full shadow-lg object-cover"
                src={video} controls={false}
                autoPlay
                onEnded={() => setShowVideo(false)}
              />
            </div>
          </div>
        )}

        {/* Microphone Button - Only show when video is not playing */}
        {!showVideo && (
          <div
            className={`flex items-center justify-center h-16 w-16 rounded-full cursor-pointer ${
              isClicked ? "bg-white text-blue-500" : "bg-transparent text-red-400"
            }`}
            onClick={handleMicClick}
          >
            <RiMic2Line size={50} />
          </div>
        )}
      </div>
    </div>
  );
}