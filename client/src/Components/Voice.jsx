import React, { useState, useEffect, useRef,useContext } from "react";
import { RepeatIcon as ArrowRepeat, Newspaper, Share2, Moon, Sun, X } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { IoAccessibilitySharp } from "react-icons/io5";
import { RiMic2Line } from "react-icons/ri";
import video from "../assets/video.mp4";
import { SiChatbot } from "react-icons/si";
import Sidebar from "./Sidebar";
import { ThemeContext } from "./ThemeContext";

export default function Voice() {
  const navigate = useNavigate();
  const {isDarkMode, setIsDarkMode} = useContext(ThemeContext);
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


  return (
    <div className={`min-h-screen ${isDarkMode? "bg-gray-900" : "text-white" } flex`}>

      <Sidebar />

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
                loop
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