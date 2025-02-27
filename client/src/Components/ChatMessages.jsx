import React, { useEffect, useRef, useState } from "react";

const TypingEffect = ({ text }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.substring(0, index));
      index++;
      if (index > text.length) clearInterval(interval);
    }, 20);

    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayedText}</span>;
};

const UserAvatar = ({ initial }) => (
  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
    {initial}
  </div>
);

const BotAvatar = () => (
  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-700 font-bold shadow-md">
    M
  </div>
);

const MessageBubble = ({ message,userInitial }) => (
  <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
    {message.sender === 'bot' && <BotAvatar />}

<div className={`max-w-[80%] rounded-lg p-3 mx-2 ${
  message.sender === 'user' ? ' text-white' : '  text-gray-800 dark:text-gray-200'
}`}>
      <p className="text-sm whitespace-pre-wrap">
        {message.sender === "bot" ? <TypingEffect text={message.text} /> : message.text}
      </p>
    </div>
    {message.sender === 'user' && <UserAvatar initial={userInitial} />}
  </div>
);

export default function ChatMessages({ messages, isLoading, error }) {
  const messagesEndRef = useRef(null);
  const [userInitial, setUserInitial] = useState("U");

  useEffect(() => {
    // Check localStorage for email when component mounts
    const storedEmail = localStorage.getItem("Email");
    if (storedEmail && storedEmail.length > 0) {
      // Get the first character of the email
      setUserInitial(storedEmail.charAt(0).toUpperCase());
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar">
      <div className="max-w-3xl mx-auto space-y-4 p-4">
      {messages.map((message, index) => (
          <MessageBubble key={index} message={message} userInitial={userInitial} />
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="rounded-lg p-3  ml-12">
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

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
