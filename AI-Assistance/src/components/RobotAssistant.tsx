import React from 'react';
import { Bot, Zap, Brain, Sparkles } from 'lucide-react';

interface RobotAssistantProps {
  id: string;
  name: string;
  avatar: string;
  specialty: string;
  onConnect: (name: string) => void;
  onHover: (id: string | null) => void;
  isHovered: boolean;
  isDarkMode: boolean;
  cursorPosition: { x: number; y: number };
}

const RobotAssistant: React.FC<RobotAssistantProps> = ({
  id,
  name,
  avatar,
  specialty,
  onConnect,
  onHover,
  isHovered,
  isDarkMode,
  cursorPosition
}) => {
  const handleClick = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        `Hello, I am ${name}, your ${specialty.toLowerCase()}. How may I help you?`
      );
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      speechSynthesis.speak(utterance);
    }
    onConnect(name);
  };

  const getIcon = () => {
    switch (id) {
      case 'jarvis': return <Bot className="w-8 h-8" />;
      case 'friday': return <Sparkles className="w-8 h-8" />;
      case 'cortana': return <Zap className="w-8 h-8" />;
      case 'nova': return <Brain className="w-8 h-8" />;
      default: return <Bot className="w-8 h-8" />;
    }
  };

  const getGradient = () => {
    if (isDarkMode) {
      switch (id) {
        case 'jarvis': return 'from-cyan-400 to-blue-600';
        case 'friday': return 'from-purple-400 to-pink-600';
        case 'cortana': return 'from-green-400 to-emerald-600';
        case 'nova': return 'from-orange-400 to-red-600';
        default: return 'from-cyan-400 to-blue-600';
      }
    } else {
      switch (id) {
        case 'jarvis': return 'from-blue-500 to-indigo-700';
        case 'friday': return 'from-purple-500 to-pink-700';
        case 'cortana': return 'from-emerald-500 to-green-700';
        case 'nova': return 'from-orange-500 to-red-700';
        default: return 'from-blue-500 to-indigo-700';
      }
    }
  };

  const getShadowColor = () => {
    switch (id) {
      case 'jarvis': return isDarkMode ? 'shadow-cyan-500/50' : 'shadow-blue-500/30';
      case 'friday': return isDarkMode ? 'shadow-purple-500/50' : 'shadow-purple-500/30';
      case 'cortana': return isDarkMode ? 'shadow-green-500/50' : 'shadow-emerald-500/30';
      case 'nova': return isDarkMode ? 'shadow-orange-500/50' : 'shadow-orange-500/30';
      default: return isDarkMode ? 'shadow-cyan-500/50' : 'shadow-blue-500/30';
    }
  };

  return (
    <div
      className={`
        relative group cursor-pointer transform transition-all duration-300 hover:scale-105
        bg-gradient-to-br ${getGradient()} p-0.5 rounded-2xl
        ${isHovered ? `shadow-lg ${getShadowColor()}` : `hover:shadow-lg ${getShadowColor()}`}
      `}
      onClick={handleClick}
      onMouseEnter={() => onHover(id)}
      onMouseLeave={() => onHover(null)}
    >
      <div className={`backdrop-blur-sm rounded-2xl p-6 h-full transition-all duration-300 ${
        isDarkMode ? 'bg-black/80' : 'bg-white/90'
      }`}>
        <div className="text-center">
          {/* Avatar with 360° rotation on hover */}
          <div 
            className={`text-6xl mb-4 transition-all duration-500 ${
              isHovered ? 'animate-spin' : 'animate-pulse'
            }`}
            style={{
              transform: isHovered 
                ? `rotate(${(cursorPosition.x + cursorPosition.y) * 0.1}deg)` 
                : 'rotate(0deg)'
            }}
          >
            {avatar}
          </div>
          
          <div className={`flex justify-center mb-4 transition-colors duration-300 ${
            isDarkMode ? 'text-cyan-400' : 'text-blue-600'
          }`}>
            {getIcon()}
          </div>
          
          <h3 className={`text-xl font-bold mb-2 transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {name}
          </h3>
          
          <p className={`text-sm opacity-80 transition-colors duration-300 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {specialty}
          </p>
          
          <div className="mt-4 flex justify-center">
            <div className={`
              w-2 h-2 rounded-full bg-gradient-to-r ${getGradient()}
              ${isHovered ? 'animate-ping' : 'animate-pulse'}
            `} />
          </div>
        </div>
        
        {/* Enhanced hover effect overlay */}
        <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
          isDarkMode 
            ? 'bg-gradient-to-br from-cyan-500/10 to-blue-500/10' 
            : 'bg-gradient-to-br from-blue-500/10 to-indigo-500/10'
        }`} />
      </div>
    </div>
  );
};

export default RobotAssistant;