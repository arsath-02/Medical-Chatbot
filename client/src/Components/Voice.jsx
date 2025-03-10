import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { RiMic2Line } from "react-icons/ri";
import Sidebar from "./Sidebar";
import { ThemeContext } from "./ThemeContext";

export default function Voice() {
  const navigate = useNavigate();
  const { isDarkMode, setIsDarkMode } = useContext(ThemeContext);
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [error, setError] = useState(null);
  const [isClicked, setIsClicked] = useState(false);
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [apiResponse, setApiResponse] = useState("");

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
      setText(transcript);
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
      setIsClicked(false);

      // Perform basic sentiment analysis based on user input
      const sentiment = analyzeSentiment(textar);

      // Create speech utterance
      const speech = new SpeechSynthesisUtterance(data.response);

      // Get available voices
      const voices = window.speechSynthesis.getVoices();
      
      const tamilVoice = voices.find(voice =>
        voice.lang.includes('ta') || voice.name.toLowerCase().includes('tamil') && voice.name.includes('Female')
      );

      if (tamilVoice) {
        speech.voice = tamilVoice;
        console.log("Using Tamil Voice:", tamilVoice.name);
      } else {
        console.warn("Tamil voice not found, using default voice.");
      }

      // Apply different tones based on emotion
      if (sentiment === 'happy') {
        speech.pitch = 1.5;   // Higher pitch for happiness
        speech.rate = 1.2;    // Slightly faster for excitement
      } else if (sentiment === 'sad') {
        speech.pitch = 0.8;   // Lower pitch for sadness
        speech.rate = 0.8;    // Slow down the speech
      } else {
        speech.pitch = 1.0;   // Neutral pitch
        speech.rate = 1.0;    // Normal speed
      }

      // Set language to Tamil
      speech.lang = 'ta-IN';
      speech.volume = 1.0;

      // Cancel any ongoing speech and start speaking
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(speech);

    } catch (err) {
      setError("Failed to get response. Please try again.");
      console.error("Chat API Error:", err);
    }
  };

  // ✅ Function to detect sentiment from text
  const analyzeSentiment = (text) => {
    const happyKeywords = ["மகிழ்ச்சி", "நன்றி", "அருமை", "நல்லது", "சந்தோஷம்", "வாழ்த்துக்கள்", "கிள்ளி"];
    const sadKeywords = ["துக்கம்", "அவலம்", "வருத்தம்", "தவிப்பு", "நஷ்டம்", "துயரம்", "மடிப"];

    const textLower = text.toLowerCase();

    // Check for happiness
    if (happyKeywords.some(word => textLower.includes(word))) {
      return 'happy';
    }

    // Check for sadness
    if (sadKeywords.some(word => textLower.includes(word))) {
      return 'sad';
    }

    // Otherwise, return neutral
    return 'neutral';
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
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

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
              className={`flex items-center justify-center h-16 w-16 rounded-full cursor-pointer ${isClicked ? "bg-white text-blue-500" : "bg-blue-500 text-white"
                } shadow-lg mx-auto transition-all duration-200 hover:scale-110`}
              onClick={handleMicClick}
            >
              <RiMic2Line size={30} />
            </div>
            <p className="mt-2 text-sm text-center text-gray-500 dark:text-gray-400">
              {isListening ? "Listening..." : "Click to speak"}
            </p>
          </div>
          {text && (
  <div className="mt-4 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md w-full max-w-md">
    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Spoken Text:</h3>
    <p className="text-sm text-gray-600 dark:text-gray-400">{text}</p>
  </div>
)}
          <div>

          </div>


        </div>
      </div>
    </div>
  );
}