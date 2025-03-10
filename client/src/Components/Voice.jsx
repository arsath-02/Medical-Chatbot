import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { RiMic2Line } from "react-icons/ri";
import video from "../assets/video.mp4";
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
  const [apiResponse, setApiResponse] = useState("");

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;
  console.log("Recognition:", recognition);
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


      setApiResponse(data.response);


      setShowVideo(false);

      const speech = new SpeechSynthesisUtterance(data.response);
      setIsClicked(false);
      setShowVideo(true);
      window.speechSynthesis.speak(speech);


      speech.onend = () => {
        setShowVideo(false);
        if (videoRef.current) {
          videoRef.current.play();
        }
      };


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

  return (
    <div className={`min-h-screen italic ${isDarkMode ? "bg-gray-900" : "bg-white"} ${isDarkMode ? "text-white" : "text-gray-900"} flex`}>

      <aside className="w-64 h-screen flex-shrink-0">
        <Sidebar />
      </aside>


      <div className="flex-1 flex flex-row">
        <div className="w-1/2 flex items-center justify-center">
          <div className="w-full max-w-md flex items-center justify-center">
            <iframe
              src="https://my.spline.design/avatarcopy-6a59820ff247b7a3c68fd762797be041/"
              width={500}
              height={500}
              frameBorder={0}
              className="mx-auto"
              allowFullScreen
            />
          </div>
        </div>


        <div className="w-1/2 flex flex-col items-center justify-center p-6">

          {apiResponse && (
            <div className="mb-8 bg-blue-50 rounded-2xl p-6 w-full max-w-md relative mx-auto shadow-lg">
              <div className="absolute w-20 h-20 rounded-full bg-blue-50 -top-6 -left-2"></div>
              <div className="absolute w-24 h-24 rounded-full bg-blue-50 -top-8 left-12"></div>
              <div className="absolute w-20 h-20 rounded-full bg-blue-50 -top-6 left-32"></div>
              <div className="absolute w-16 h-16 rounded-full bg-blue-50 -top-4 right-12"></div>
              <div className="absolute w-12 h-12 rounded-full bg-blue-50 -top-2 right-2"></div>


              <p className="text-gray-800 text-center font-medium z-10 relative pt-4">
                {apiResponse}
              </p>
            </div>
          )}


          {!apiResponse && (
            <div className="mb-8 bg-blue-50 rounded-2xl p-6 w-full max-w-md relative mx-auto shadow-lg">

              <div className="absolute w-20 h-20 rounded-full bg-blue-50 -top-6 -left-2"></div>
              <div className="absolute w-24 h-24 rounded-full bg-blue-50 -top-8 left-12"></div>
              <div className="absolute w-20 h-20 rounded-full bg-blue-50 -top-6 left-32"></div>
              <div className="absolute w-16 h-16 rounded-full bg-blue-50 -top-4 right-12"></div>
              <div className="absolute w-12 h-12 rounded-full bg-blue-50 -top-2 right-2"></div>

              <p className="text-gray-500 text-center font-medium z-10 relative pt-4">
                Speak to start a conversation...
              </p>
            </div>
          )}

        
          <div className="mt-4">
            <div
              className={`flex items-center justify-center h-16 w-16 rounded-full cursor-pointer ${
                isClicked ? "bg-white text-blue-500" : "bg-blue-500 text-white"
              } shadow-lg mx-auto transition-all duration-200 hover:scale-110`}
              onClick={handleMicClick}
            >
              <RiMic2Line size={30} />
            </div>
            <p className="mt-2 text-sm text-center text-gray-500 dark:text-gray-400">
              {isListening ? "Listening..." : "Click to speak"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}