import React from "react";
import { RepeatIcon as ArrowRepeat, Newspaper, Share2, Moon, Sun } from "lucide-react";
import { IoAccessibilitySharp } from "react-icons/io5";

import { SiChatbot } from "react-icons/si";
export default function Sidebar({ handleRefreshChat, handleToggleChatHistory, handleShareChat, isDarkMode, setIsDarkMode, handleLogin, showChatHistory,handleVoice ,handlechatbot}) {
  return (
    <div className="w-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-r border-gray-100 dark:border-gray-800 flex flex-col items-center py-4 space-y-6 z-20">
      <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center text-white dark:text-black text-sm font-bold">
        M
      </div>
      <div className="space-y-6">
        <button onClick={handleRefreshChat} className="p-2 hover-bg rounded-lg transition-colors">
          <ArrowRepeat className="w-5 h-5 icon ml-3" />
        </button>
        <button
          onClick={handleToggleChatHistory}
          className={`p-2 ${showChatHistory ? 'bg-gray-200 dark:bg-gray-700' : 'hover-bg'} rounded-lg transition-colors`}
        >
          <Newspaper className={`w-5 h-5 ml-3 ${showChatHistory ? 'text-blue-500' : 'icon'}`} />
        </button>
        <button onClick={handleShareChat} className="p-2 hover-bg rounded-lg transition-colors">
          <Share2 className="w-5 h-5 icon ml-3" />
        </button>
      </div>
      <div className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  <div className="ml-1">
                    <IoAccessibilitySharp color="gray" size={20} onClick={handleVoice} />
                  </div>
                </div>
       <div className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                            <div className="ml-1">
                          <SiChatbot color="gray" size={20} onClick={handlechatbot} />
                          </div>
                          </div>
      
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="p-2 hover-bg rounded-lg transition-colors"
      >
        {isDarkMode ? (
          <Sun className="w-5 h-5 icon" />
        ) : (
          <Moon className="w-5 h-5 icon" />
        )}
      </button>
      <button className="mt-5 p-2 bg-gray-200 dark:bg-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300" onClick={handleLogin}>
        Login
      </button>
    </div>
  );
}