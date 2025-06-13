import React, { useState } from 'react';
import { Gamepad2 } from 'lucide-react';
import GameModal from './GameModal';

interface GameZoneProps {
  isDarkMode: boolean;
}

const GameZone: React.FC<GameZoneProps> = ({ isDarkMode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const games = [
    { id: 'snake', name: 'Snake Game', emoji: '🐍', description: 'Classic snake game' },
    { id: 'tetris', name: 'Tetris', emoji: '🧱', description: 'Block puzzle game' },
    { id: 'flappy', name: 'Flappy Bird', emoji: '🐤', description: 'Tap to fly' },
    { id: 'tictactoe', name: 'Tic-Tac-Toe', emoji: '❌', description: 'Classic X and O' },
    { id: 'memory', name: 'Memory Flip', emoji: '🧠', description: 'Match the cards' },
    { id: '2048', name: '2048', emoji: '🧊', description: 'Number puzzle' },
    { id: 'puzzle', name: 'Puzzle Game', emoji: '🧩', description: 'Sliding puzzle' },
    { id: 'bubble', name: 'Bubble Shooter', emoji: '🔵', description: 'Pop the bubbles' },
    { id: 'temple', name: 'Temple Run', emoji: '🏃', description: 'Endless runner' },
    { id: 'ludo', name: 'Ludo', emoji: '🎲', description: 'Board game' }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className={`text-2xl md:text-3xl font-bold text-center mb-8 transition-colors duration-500 ${
        isDarkMode ? 'text-cyan-400' : 'text-blue-600'
      }`}>
        Quantum Game Zone
      </h2>
      
      <div className="text-center">
        <button
          onClick={() => setIsModalOpen(true)}
          className={`group relative px-8 py-4 rounded-2xl font-bold text-white text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
            isDarkMode
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-purple-500/50'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-purple-600/50'
          }`}
        >
          <div className="flex items-center gap-3">
            <Gamepad2 className="w-8 h-8" />
            <span>🎮 Play Games</span>
          </div>
          
          <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 ${
            isDarkMode
              ? 'bg-gradient-to-r from-purple-600 to-pink-600'
              : 'bg-gradient-to-r from-purple-700 to-pink-700'
          }`} />
        </button>
        
        <p className={`mt-4 transition-colors duration-500 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Experience {games.length} quantum-enhanced games
        </p>
      </div>

      {/* Game Modal */}
      {isModalOpen && (
        <GameModal
          games={games}
          onClose={() => setIsModalOpen(false)}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
};

export default GameZone;