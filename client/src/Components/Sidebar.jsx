import React, { useState, useEffect } from "react";
import { RepeatIcon as ArrowRepeat, Newspaper, Share2, Moon, Sun } from "lucide-react";
import { IoAccessibilitySharp } from "react-icons/io5";
import { SiChatbot } from "react-icons/si";
import { GiEntryDoor } from "react-icons/gi";
import {useNavigate} from "react-router-dom";
import { MdHealthAndSafety } from "react-icons/md";

import { IoLogoGameControllerB } from "react-icons/io";

import { useContext } from "react";
import { ThemeContext } from "./ThemeContext";


export default function Sidebar({ handleRefreshChat, handleToggleChatHistory, handleShareChat, handleLogin, showChatHistory, handleVoice }) {
  const {isDarkMode, setIsDarkMode} = useContext(ThemeContext);
  const [userInitial, setUserInitial] = useState(null);

  const ToogleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

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
  const handlegame=()=>{
    navigate("/game-selector");
  }




  return (
    <div
      className={`fixed w-16 backdrop-blur-sm border-r flex flex-col items-center py-10 space-y-7 z-20
        ${isDarkMode ? "bg-gray-900 text-white border-gray-800" : "bg-white text-gray-800 border-gray-100"}`}
    >

    <div
      className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold
        ${isDarkMode ? "bg-white text-black" : "bg-gray-900 text-white"}`}
    >
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
        onClick={ToogleTheme}
        className="p-2 hover-bg rounded-lg transition-colors"
      >
        {isDarkMode ? (
          <Sun className="w-5 h-5 icon" />
        ) : (
          <Moon className="w-5 h-5 icon" />
        )}
      </button>

      {/* Show logout door icon if user is logged in */}
      <div className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
        <div className="ml-1">
          <IoLogoGameControllerB color="gray" size={20} onClick={handlegame}/>
        </div>
      </div>

      {userInitial ? (
  <div
    className={`mt-auto w-10 h-10 rounded-full flex items-center justify-center font-bold
      ${isDarkMode ? "bg-white text-gray-900" : "bg-gray-900 text-white"}`}
  >
    {userInitial}
  </div>
) : (
  <button
    className={`mt-auto p-2 rounded-lg text-sm transition-all
      ${isDarkMode ? "bg-gray-800 text-gray-300 hover:bg-gray-700" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
    onClick={handleLogin}
  >
    Login
  </button>
)}


{userInitial && (
<div className="p-2 mt-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer" onClick={handleLogout}>
<div className="ml-2 flex items-center">
<GiEntryDoor color="gray" size={25} />
</div>
</div>
)}
    </div>
  );
}