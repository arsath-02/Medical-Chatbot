import React from 'react';
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
const HomePage = () => {
  const navigate=useNavigate();
  const handleclick =() =>{
  navigate('/chatbot');<ZASQW> '
  </ZASQW>
  }
  return (
    <div className="w-full h-screen flex justify-center items-center relative">
      <iframe
        src="https://my.spline.design/dominoeffectphysicscopy-77bdb140db0193f11d6697ce5d8379b7/"
        className="w-full h-full"
        frameBorder="0"
        allowFullScreen
      ></iframe>
     <button className="absolute flex items-center justify-between px-6 py-3 w-50 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-600 transition" onClick={handleclick}>
        <span className="text-left">GET STARTED</span>
        <span className=" flex justify-center">
          <FaArrowRight />
        </span>
      </button>
    </div>
  );
};

export default HomePage;
