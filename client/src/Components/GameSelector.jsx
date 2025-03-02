import React from 'react'
import Sidebar from './Sidebar'
import logo1 from '../assets/game1.png'
import logo2 from '../assets/game2.png'
import logo3 from '../assets/game3.png'
import logo4 from '../assets/game4.png'
import logo5 from '../assets/game5.png'
import logo6 from '../assets/game6.png'

const GameSelector = () => {
  // Sample game data - replace descriptions with your actual content
  const games = [
    { id: 1, image: logo1, name: "Game 1", description: "Action-packed adventure" },
    { id: 2, image: logo2, name: "Game 2", description: "Strategic puzzle game" },
    { id: 3, image: logo3, name: "Game 3", description: "Epic RPG experience" },
    { id: 4, image: logo4, name: "Game 4", description: "Multiplayer battle arena" },
    { id: 5, image: logo5, name: "Game 5", description: "Racing simulation" },
    { id: 6, image: logo6, name: "Game 6", description: "Survival horror" },
  ];

  return (
    <div className="min-h-screen ">
      <div>
        <Sidebar />
      </div>

      <div className="py-8  shadow-sm">
        <h1 className="text-center text-black text-4xl font-bold">
          Select The Game You Like
        </h1>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <div
              key={game.id}
              className=" rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="relative group">
                <img
                  src={game.image}
                  alt={game.name}
                  className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-60 transition-opacity duration-300 flex items-end">
                  <div className="p-4 text-black opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="text-xl font-semibold mb-1">{game.name}</h3>
                    <p className="text-sm">{game.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default GameSelector