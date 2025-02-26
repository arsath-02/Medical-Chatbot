import React, { useState, useEffect } from "react";
import { Play } from "lucide-react";
import { CuboidIcon as Cube, Link, RepeatIcon as ArrowRepeat, Newspaper, Share2, Moon, Sun, X } from "lucide-react";

export default function ChatInput({ handleSendMessage, inputValue, setInputValue, isLoading }) {
  const [isTyping, setIsTyping] = useState(false);

  const handleTyping = (e) => {
    setInputValue(e.target.value);
    setIsTyping(true);
  };

  useEffect(() => {
    if (inputValue === "") {
      setIsTyping(false);
    }
  }, [inputValue]);

  return (
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
              </div>

        <div className="relative">
          
          <div className="mt-2 border dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-800">
            <div className="px-4 pb-4">
              <input
                type="text"
                placeholder="Ask Medi..."
                className="w-full p-2 outline-none text-gray-700 dark:text-gray-200 bg-transparent"
                onFocus={() => setIsTyping(true)}
                onBlur={() => setIsTyping(false)}
                value={inputValue}
                onChange={handleTyping}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                disabled={isLoading}
              />
            </div>
            <div className="border-t dark:border-gray-700 flex justify-end p-2 space-x-2">
              <button onClick={handleSendMessage} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Play className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}