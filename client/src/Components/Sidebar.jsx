import React, { useState, useEffect } from "react";
import { RepeatIcon as ArrowRepeat, Newspaper, Share2, Moon, Sun } from "lucide-react";
import { IoAccessibilitySharp } from "react-icons/io5";
import { SiChatbot } from "react-icons/si";
import { GiEntryDoor } from "react-icons/gi";
import {useNavigate} from "react-router-dom";
import { MdHealthAndSafety } from "react-icons/md";

export default function Sidebar({ handleRefreshChat, handleToggleChatHistory, handleShareChat, isDarkMode, setIsDarkMode, handleLogin, showChatHistory, handleVoice }) {
  const [userInitial, setUserInitial] = useState(null);

  const navigate=useNavigate();
  useEffect(() => {
    // Check localStorage for email when component mounts
    const storedEmail = localStorage.getItem("Email");
    if (storedEmail && storedEmail.length > 0) {
      // Get the first character of the email
      setUserInitial(storedEmail.charAt(0).toUpperCase());
    }
  }, []);

  const handleLogout = () => {
    // Clear the email from localStorage
    localStorage.removeItem("Email");

    // Reset the user initial
    setUserInitial(null);

    // Redirect to login page
    window.location.href = "/login";
  };
  const handlechatbot=()=>{
    navigate("/chatbot");
  }
  const handlehealth=()=>{
    navigate("/FitbitLogin");
  }




  return (
    <div className="w-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-r border-gray-100 dark:border-gray-800 flex flex-col items-center py-4 space-y-6 z-20">
      <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center text-white dark:text-black text-sm font-bold">
        M
      </div>

      <div className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg ">
      <div className="ml-1">
          <ArrowRepeat size={20} color="gray" onClick={handleRefreshChat}/>
          </div>
          </div>
        <div className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
        <div className="ml-1">
          <Newspaper size={20} color="gray" onClick={handleToggleChatHistory} />
          </div>
          </div>
        <div className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
        <div className="ml-1">
          <Share2 color="gray" size={20} onClick={handleShareChat} />
          </div>
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
      <div className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
        <div className="ml-1">
          <MdHealthAndSafety color="gray" size={20} onClick={handlehealth} />
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

      {/* Show logout door icon if user is logged in */}


{userInitial ? (
  <div className="mt-auto w-10 h-10 bg-white text-gray-700 rounded-full flex items-center justify-center font-bold">
    {userInitial}
  </div>
) : (
  <button className="mt-auto p-2 bg-gray-200 dark:bg-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300" onClick={handleLogin}>
    Login
  </button>
)}

{userInitial && (
<div className="p-2 mt-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer" onClick={handleLogout}>
<div className="ml-2 flex items-center">
<GiEntryDoor color="gray" size={25} />
</div>
</div>
)}
    </div>
  );
}