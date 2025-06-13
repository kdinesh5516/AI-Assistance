import React, { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';

interface SmartSearchProps {
  isDarkMode: boolean;
}

const SmartSearch: React.FC<SmartSearchProps> = ({ isDarkMode }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const lowerQuery = query.toLowerCase();
    
    // Smart command recognition
    if (lowerQuery.includes('youtube') || lowerQuery.includes('video')) {
      window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`, '_blank');
    } else if (lowerQuery.includes('calculator') || lowerQuery.includes('math')) {
      window.open('https://www.google.com/search?q=online+calculator', '_blank');
    } else if (lowerQuery.includes('weather')) {
      window.open(`https://www.google.com/search?q=weather+${encodeURIComponent(query)}`, '_blank');
    } else if (lowerQuery.includes('news')) {
      window.open(`https://www.google.com/search?q=news+${encodeURIComponent(query)}`, '_blank');
    } else {
      // Default to YouTube search for entertainment queries
      window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`, '_blank');
    }
    
    setQuery('');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className={`text-2xl md:text-3xl font-bold text-center mb-8 transition-colors duration-500 ${
        isDarkMode ? 'text-cyan-400' : 'text-blue-600'
      }`}>
        Neural Search Interface
      </h2>
      
      <form onSubmit={handleSearch} className="relative">
        <div className={`
          relative backdrop-blur-sm rounded-2xl p-1 transition-all duration-300
          ${isFocused 
            ? isDarkMode
              ? 'shadow-lg shadow-cyan-500/50 border-2 border-cyan-400' 
              : 'shadow-lg shadow-blue-500/50 border-2 border-blue-400'
            : isDarkMode
              ? 'border border-cyan-500/30 hover:border-cyan-400/50 bg-black/60'
              : 'border border-blue-300 hover:border-blue-400/50 bg-white/60 shadow-md'
          }
        `}>
          <div className="flex items-center">
            <div className="flex items-center pl-4">
              <Search className={`w-5 h-5 transition-colors duration-300 ${
                isFocused 
                  ? isDarkMode ? 'text-cyan-400' : 'text-blue-600'
                  : isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
            </div>
            
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Ask NEUROSPHERE anything..."
              className={`flex-1 bg-transparent px-4 py-4 focus:outline-none text-lg transition-colors duration-300 ${
                isDarkMode 
                  ? 'text-white placeholder-gray-400' 
                  : 'text-gray-900 placeholder-gray-500'
              }`}
            />
            
            <button
              type="submit"
              className={`mr-2 p-2 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg ${
                isDarkMode
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400'
                  : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500'
              }`}
            >
              <Sparkles className="w-5 h-5 text-white" />
            </button>
          </div>
          
          {/* Animated border effect */}
          {isFocused && (
            <div className={`absolute inset-0 rounded-2xl opacity-20 animate-pulse -z-10 ${
              isDarkMode 
                ? 'bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500' 
                : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500'
            }`} />
          )}
        </div>
        
        <div className="mt-4 text-center">
          <p className={`text-sm mb-2 transition-colors duration-500 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Smart recognition for:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              'YouTube videos',
              'Calculator',
              'Weather',
              'News',
              'General search'
            ].map((category, index) => (
              <span 
                key={index}
                className={`px-3 py-1 rounded-full text-xs border transition-all duration-500 ${
                  isDarkMode
                    ? 'bg-gray-700/50 text-cyan-300 border-cyan-500/30'
                    : 'bg-blue-50 text-blue-700 border-blue-300'
                }`}
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};

export default SmartSearch;