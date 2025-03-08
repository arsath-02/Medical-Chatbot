import React, { useEffect, useRef, useState, useContext } from "react";
import { ThemeContext } from "./ThemeContext";
import { TbReportAnalytics } from "react-icons/tb";
const TypingEffect = ({ text }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    setDisplayedText("");
    setIsDone(false);

    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.substring(0, index));
      index++;
      if (index > text.length) {
        clearInterval(interval);
        setIsDone(true);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayedText}{!isDone && "█"}</span>;
};

const UserAvatar = ({ initial }) => (
  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
    {initial}
  </div>
);

const BotAvatar = ({ isDarkMode }) => (
  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-md bg-gradient-to-br from-pink-500 to-purple-600 text-white`}>
    B
  </div>
);

const MessageBubble = ({ message, userInitial, isDarkMode, shouldShowTypingEffect }) => {
  if (!message || !message.sender || !message.text) return null;

  return (
    <div className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} mb-4`}>
      {message.sender === "bot" && <BotAvatar isDarkMode={isDarkMode} />}

      <div
        className={`max-w-[80%] rounded-lg p-3 mx-2 ${
          message.sender === "user"
            ? "bg-gray-600 text-white"
            : isDarkMode
            ? "bg-gray-900 text-white"
            : "bg-white text-gray-900"
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">
          {message.sender === "bot" && shouldShowTypingEffect ? (
            <TypingEffect text={message.text} />
          ) : (
            message.text
          )}
        </p>
      </div>

      {message.sender === "user" && <UserAvatar initial={userInitial} />}
    </div>
  );
};

export default function ChatMessages({ messages, isLoading, error }) {
  const messagesEndRef = useRef(null);
  const [userInitial, setUserInitial] = useState("U");
  const { isDarkMode } = useContext(ThemeContext);
  const [showTypingEffect, setShowTypingEffect] = useState(false);
  const [typingMessageIndex, setTypingMessageIndex] = useState(null);
  const prevMessagesRef = useRef([]);
  const isInitialLoadRef = useRef(true);
  const name = localStorage.getItem("Name") || "User";

  useEffect(() => {
    // Check localStorage for name or email when component mounts
    const storedName = localStorage.getItem("Name");
    const storedEmail = localStorage.getItem("Email");

    if (storedName && storedName.length > 0) {
      setUserInitial(storedName.charAt(0).toUpperCase());
    } else if (storedEmail && storedEmail.length > 0) {
      setUserInitial(storedEmail.charAt(0).toUpperCase());
    }
  }, []);

  useEffect(() => {
    // Skip the effect for initial load of messages
    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false;
      prevMessagesRef.current = [...messages];
      return;
    }

    // Check if a new message was added
    if (messages.length > prevMessagesRef.current.length) {
      const lastMessageIndex = messages.length - 1;
      const lastMessage = messages[lastMessageIndex];

      // Only show typing effect for new bot messages
      if (lastMessage.sender === "bot") {
        setShowTypingEffect(true);
        setTypingMessageIndex(lastMessageIndex);

        // Auto-disable typing effect after it would finish
        const timer = setTimeout(() => {
          setShowTypingEffect(false);
        }, lastMessage.text.length * 20 + 100);

        return () => clearTimeout(timer);
      }
    }

    // Update previous messages reference
    prevMessagesRef.current = [...messages];
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
// font-serif font-sans font-mono
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar italic">
      <div className="max-w-3xl mx-auto space-y-4 p-4">
        {messages.length > 0 ? (
          // If there are messages, display them
          messages.map((message, index) => (
            <MessageBubble
              key={index}
              message={message}
              isDarkMode={isDarkMode}
              userInitial={userInitial}
              shouldShowTypingEffect={showTypingEffect && index === typingMessageIndex}
            />
          ))
        ) : (
          // If no messages, show welcome message with name
          <div className="flex justify-start mb-4">
            <BotAvatar isDarkMode={isDarkMode} />
            <div
              className={`max-w-[80%] rounded-lg p-3 mx-2 ${
                isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
              }`}
            >
              <div>
              <TbReportAnalytics />

                </div>
              <p className="text-sm whitespace-pre-wrap">
                <TypingEffect text={`Hi ${name}, I am Dr.Chat 😊`} />
              </p>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-start">
            <BotAvatar isDarkMode={isDarkMode} />
            <div className={`rounded-lg p-3 shadow-md ml-2 ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}>
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-center">
            <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg p-3 text-sm">
              {error}
              <button
                className="ml-2 underline"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}