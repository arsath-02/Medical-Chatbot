import React, { useState, useEffect } from 'react';
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  const [showControls, setShowControls] = useState(false);

  const handleclick = () => {
    navigate('/chatbot');
  };

  // Show controls when mouse enters the page
  useEffect(() => {
    const handleMouseEnter = () => {
      setShowControls(true);

      // Hide controls after 2 seconds
      const timer = setTimeout(() => {
        setShowControls(false);
      }, 4000);

      // Clean up the timer if component unmounts before timeout
      return () => clearTimeout(timer);
    };

    // Add event listener to the document
    document.addEventListener('mouseenter', handleMouseEnter);

    // Show controls immediately when page loads
    setShowControls(true);
    const initialTimer = setTimeout(() => {
      setShowControls(false);
    }, 2000);

    // Clean up event listeners and timers
    return () => {
      document.removeEventListener('mouseenter', handleMouseEnter);
      clearTimeout(initialTimer);
    };
  }, []);

  return (
    <div className="w-full h-screen flex justify-center items-center relative">
      <iframe
        src="https://my.spline.design/dominoeffectphysicscopy-77bdb140db0193f11d6697ce5d8379b7/"
        className="w-full h-full"
        frameBorder="0"
        allowFullScreen
      ></iframe>

      {/* Controls tooltip */}
      {showControls && (
        <div className="absolute top-8 bg-black bg-opacity-75 text-white px-6 py-3 rounded-lg transition-opacity">
          <p className="font-medium text-center">
            W for straight • A for left • D for right • S for down
          </p>
        </div>
      )}

      <div className="absolute flex flex-col items-center gap-4">
        <h1 className="text-4xl font-bold text-black text-center">
          MEDI
        </h1>
        <button
          className="flex items-center justify-between px-6 py-3 w-50 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-600 transition"
          onClick={handleclick}
        >
          <span className="text-left">GET STARTED</span>
          <span className="flex justify-center">
            <FaArrowRight />
          </span>
        </button>
      </div>
    </div>
  );
};

export default HomePage;