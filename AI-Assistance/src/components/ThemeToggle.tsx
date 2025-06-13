import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDarkMode, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`fixed top-6 right-6 z-50 p-3 rounded-full transition-all duration-500 transform hover:scale-110 ${
        isDarkMode
          ? 'bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg shadow-yellow-500/50 hover:shadow-yellow-500/70'
          : 'bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/50 hover:shadow-indigo-500/70'
      }`}
    >
      <div className="relative w-6 h-6">
        <Sun 
          className={`absolute inset-0 w-6 h-6 text-white transition-all duration-500 ${
            isDarkMode ? 'opacity-100 rotate-0' : 'opacity-0 rotate-180'
          }`} 
        />
        <Moon 
          className={`absolute inset-0 w-6 h-6 text-white transition-all duration-500 ${
            isDarkMode ? 'opacity-0 -rotate-180' : 'opacity-100 rotate-0'
          }`} 
        />
      </div>
      
      {/* Glow effect */}
      <div className={`absolute inset-0 rounded-full transition-all duration-500 ${
        isDarkMode 
          ? 'bg-yellow-400 opacity-20 animate-pulse' 
          : 'bg-indigo-500 opacity-20 animate-pulse'
      }`} />
    </button>
  );
};

export default ThemeToggle;