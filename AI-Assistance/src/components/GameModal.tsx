import React, { useState } from 'react';
import { X, Play } from 'lucide-react';
import SnakeGame from '../games/SnakeGame';
import TetrisGame from '../games/TetrisGame';
import FlappyBirdGame from '../games/FlappyBirdGame';
import TicTacToeGame from '../games/TicTacToeGame';
import MemoryGame from '../games/MemoryGame';
import Game2048 from '../games/Game2048';

interface Game {
  id: string;
  name: string;
  emoji: string;
  description: string;
}

interface GameModalProps {
  games: Game[];
  onClose: () => void;
  isDarkMode: boolean;
}

const GameModal: React.FC<GameModalProps> = ({ games, onClose, isDarkMode }) => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const renderGame = () => {
    switch (selectedGame) {
      case 'snake':
        return <SnakeGame />;
      case 'tetris':  
        return <TetrisGame />;
      case 'flappy':
        return <FlappyBirdGame />;
      case 'tictactoe':
        return <TicTacToeGame />;
      case 'memory':
        return <MemoryGame />;
      case '2048':
        return <Game2048 />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className={`m-4 max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl p-6 border transition-all duration-300 ${
        isDarkMode
          ? 'bg-black/90 border-cyan-500/30'
          : 'bg-white/90 border-blue-300 shadow-xl'
      }`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-2xl font-bold transition-colors duration-300 ${
            isDarkMode ? 'text-cyan-400' : 'text-blue-600'
          }`}>
            {selectedGame ? games.find(g => g.id === selectedGame)?.name : 'Game Selection'}
          </h3>
          <button
            onClick={selectedGame ? () => setSelectedGame(null) : onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode 
                ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {selectedGame ? (
          <div className="min-h-[400px]">
            {renderGame()}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {games.map((game) => (
              <div
                key={game.id}
                onClick={() => setSelectedGame(game.id)}
                className={`group cursor-pointer rounded-xl p-4 border transition-all duration-300 transform hover:scale-105 ${
                  isDarkMode
                    ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:border-cyan-500/50'
                    : 'bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:border-blue-400/50 shadow-md hover:shadow-lg'
                }`}
              >
                <div className="text-center">
                  <div className="text-4xl mb-3">{game.emoji}</div>
                  <h4 className={`font-bold mb-2 transition-colors duration-300 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {game.name}
                  </h4>
                  <p className={`text-sm mb-3 transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {game.description}
                  </p>
                  
                  <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className={`w-4 h-4 ${isDarkMode ? 'text-cyan-400' : 'text-blue-600'}`} />
                    <span className={`text-sm ${isDarkMode ? 'text-cyan-400' : 'text-blue-600'}`}>
                      Play Now
                    </span>
                  </div>
                </div>
                
                {/* Hover effect */}
                <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                  isDarkMode 
                    ? 'bg-gradient-to-br from-cyan-500/10 to-blue-500/10' 
                    : 'bg-gradient-to-br from-blue-500/10 to-indigo-500/10'
                }`} />
              </div>
            ))}
          </div>
        )}
        
        {!selectedGame && (
          <div className="mt-6 text-center">
            <p className={`transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Select a game to start playing!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameModal;