import React, { useState } from 'react';
import AnimatedBackground from './components/AnimatedBackground';
import RobotAssistant from './components/RobotAssistant';
import VoiceCommand from './components/VoiceCommand';
import SmartSearch from './components/SmartSearch';
import GameZone from './components/GameZone';
import EmojiFollower from './components/EmojiFollower';
import ThemeToggle from './components/ThemeToggle';
import ContactMeWidget from './components/ContactMeWidget';

function App() {
  const [connectedAssistant, setConnectedAssistant] = useState<string>('');
  const [hoveredAssistantId, setHoveredAssistantId] = useState<string | null>(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('neurosphere-theme');
    return saved ? JSON.parse(saved) : true;
  });

  const assistants = [
    { id: 'jarvis', name: 'JARVIS', avatar: '🤖', specialty: 'General AI Assistant' },
    { id: 'friday', name: 'FRIDAY', avatar: '🔮', specialty: 'Data Analysis' },
    { id: 'cortana', name: 'CORTANA', avatar: '⚡', specialty: 'System Control' },
    { id: 'nova', name: 'NOVA', avatar: '🧠', specialty: 'Smart Home' }
  ];

  const handleMouseMove = (e: React.MouseEvent) => {
    setCursorPosition({ x: e.clientX, y: e.clientY });
  };

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('neurosphere-theme', JSON.stringify(newTheme));
  };

  return (
    <div 
      className={`min-h-screen overflow-x-hidden transition-all duration-500 ${
        isDarkMode 
          ? 'bg-black text-white' 
          : 'bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-900'
      }`} 
      onMouseMove={handleMouseMove}
    >
      <AnimatedBackground isDarkMode={isDarkMode} />
      
      {/* Theme Toggle */}
      <ThemeToggle isDarkMode={isDarkMode} onToggle={toggleTheme} />
      
      {/* Header */}
      <header className="relative z-10 text-center py-8 px-4">
        <h1 className={`text-4xl md:text-6xl font-bold mb-4 transition-all duration-500 ${
          isDarkMode
            ? 'bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent'
            : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent'
        }`}>
          NEUROSPHERE AI
        </h1>
        <p className={`text-lg md:text-xl opacity-80 transition-colors duration-500 ${
          isDarkMode ? 'text-cyan-300' : 'text-blue-600'
        }`}>
          Advanced Neural Interface • Voice Activated • Quantum Enhanced
        </p>
        {connectedAssistant && (
          <div className={`mt-4 px-6 py-2 border rounded-full inline-block transition-all duration-500 ${
            isDarkMode 
              ? 'bg-green-500/20 border-green-400 text-green-400' 
              : 'bg-green-100 border-green-500 text-green-700'
          }`}>
            <span>● Connected to {connectedAssistant}</span>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 pb-20">
        {/* AI Assistants Grid */}
        <section className="mb-12">
          <h2 className={`text-2xl md:text-3xl font-bold text-center mb-8 transition-colors duration-500 ${
            isDarkMode ? 'text-cyan-400' : 'text-blue-600'
          }`}>
            Select Your AI Assistant
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {assistants.map((assistant) => (
              <RobotAssistant
                key={assistant.id}
                id={assistant.id}
                name={assistant.name}
                avatar={assistant.avatar}
                specialty={assistant.specialty}
                onConnect={setConnectedAssistant}
                onHover={setHoveredAssistantId}
                isHovered={hoveredAssistantId === assistant.id}
                isDarkMode={isDarkMode}
                cursorPosition={cursorPosition}
              />
            ))}
          </div>
        </section>

        {/* Voice Command Section */}
        <section className="mb-12">
          <VoiceCommand isDarkMode={isDarkMode} />
        </section>

        {/* Smart Search Section */}
        <section className="mb-12">
          <SmartSearch isDarkMode={isDarkMode} />
        </section>

        {/* Game Zone Section */}
        <section>
          <GameZone isDarkMode={isDarkMode} />
        </section>
      </main>

      {/* Emoji Follower */}
      {hoveredAssistantId && (
        <EmojiFollower
          emoji={assistants.find(a => a.id === hoveredAssistantId)?.avatar || '🤖'}
          position={cursorPosition}
        />
      )}

      {/* Contact Widget */}
      <ContactMeWidget isDarkMode={isDarkMode} />
    </div>
  );
}

export default App;