import React, { useEffect, useRef, useState } from "react";
import { CuboidIcon as Cube, Link, RepeatIcon as ArrowRepeat, Newspaper, Share2, Moon, Sun, X } from "lucide-react";

const TypingEffect = ({ text }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.substring(0, index));
      index++;
      if (index > text.length) clearInterval(interval);
    }, 20); // Speed of typing

    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayedText}</span>;
};

const MessageBubble = ({ message }) => (
  <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
    <div className={`max-w-[80%] rounded-lg p-3 ${
      message.sender === 'user' ? 'bg-blue-500 text-white' : 'text-gray-800 dark:text-gray-200'
    }`}>
      {message.sender === 'bot' && (
        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full mb-2 flex items-center justify-center">
          <span className="text-sm">M</span>
        </div>
      )}
      <p className="text-sm whitespace-pre-wrap">
        {message.sender === "bot" ? <TypingEffect text={message.text} /> : message.text}
      </p>
    </div>
  </div>
);

export default function ChatMessages({ messages, isLoading, error }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar">
      <div className="max-w-3xl mx-auto space-y-4 p-4">
        {messages.map((message, index) => (
          <MessageBubble key={index} message={message} />
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="rounded-lg p-3">
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
