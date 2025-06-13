import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';

interface VoiceCommandProps {
  isDarkMode: boolean;
}

const VoiceCommand: React.FC<VoiceCommandProps> = ({ isDarkMode }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        setTranscript(transcript);
        handleCommand(transcript);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const handleCommand = (command: string) => {
    let responseText = '';
    
    if (command.includes('open youtube')) {
      window.open('https://youtube.com', '_blank');
      responseText = 'Opening YouTube for you...';
    } else if (command.includes('play ')) {
      const query = command.replace('play ', '');
      window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`, '_blank');
      responseText = `Playing ${query} on YouTube...`;
    } else if (command.includes('calculator')) {
      window.open('https://www.google.com/search?q=online+calculator', '_blank');
      responseText = 'Opening calculator...';
    } else if (command.includes('camera')) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          responseText = 'Camera access granted!';
          // You can display the stream in a video element if needed
        })
        .catch(() => {
          responseText = 'Camera access denied.';
        });
    } else {
      responseText = `I heard "${command}" but I'm not sure how to help with that.`;
    }
    
    setResponse(responseText);
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(responseText);
      speechSynthesis.speak(utterance);
    }
  };

  const toggleListening = () => {
    if (recognition) {
      if (isListening) {
        recognition.stop();
      } else {
        recognition.start();
        setIsListening(true);
        setTranscript('');
        setResponse('');
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className={`text-2xl md:text-3xl font-bold text-center mb-8 transition-colors duration-500 ${
        isDarkMode ? 'text-cyan-400' : 'text-blue-600'
      }`}>
        Neural Voice Interface
      </h2>
      
      <div className={`backdrop-blur-sm border rounded-2xl p-6 transition-all duration-500 ${
        isDarkMode 
          ? 'bg-black/60 border-cyan-500/30' 
          : 'bg-white/60 border-blue-300 shadow-lg'
      }`}>
        <div className="text-center mb-6">
          <button
            onClick={toggleListening}
            className={`
              relative p-4 rounded-full transition-all duration-300 transform hover:scale-110
              ${isListening 
                ? 'bg-red-500 shadow-lg shadow-red-500/50 animate-pulse' 
                : isDarkMode
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70'
                  : 'bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70'
              }
            `}
            disabled={!recognition}
          >
            {isListening ? (
              <MicOff className="w-8 h-8 text-white" />
            ) : (
              <Mic className="w-8 h-8 text-white" />
            )}
            
            {isListening && (
              <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-30" />
            )}
          </button>
          
          <p className={`mt-4 transition-colors duration-500 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {isListening ? 'Listening...' : 'Click to start voice command'}
          </p>
        </div>

        {transcript && (
          <div className={`rounded-lg p-4 mb-4 transition-all duration-500 ${
            isDarkMode ? 'bg-gray-800/50' : 'bg-blue-50'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <Volume2 className={`w-4 h-4 ${isDarkMode ? 'text-cyan-400' : 'text-blue-600'}`} />
              <span className={`font-semibold ${isDarkMode ? 'text-cyan-400' : 'text-blue-600'}`}>
                You said:
              </span>
            </div>
            <p className={isDarkMode ? 'text-white' : 'text-gray-900'}>{transcript}</p>
          </div>
        )}

        {response && (
          <div className={`rounded-lg p-4 border transition-all duration-500 ${
            isDarkMode 
              ? 'bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-cyan-500/30' 
              : 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-blue-300'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <Volume2 className="w-4 h-4 text-green-400" />
              <span className="text-green-400 font-semibold">NEUROSPHERE:</span>
            </div>
            <p className={isDarkMode ? 'text-white' : 'text-gray-900'}>{response}</p>
          </div>
        )}

        <div className="mt-6 text-center">
          <p className={`text-sm mb-2 transition-colors duration-500 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Try commands like:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              '"Open YouTube"',
              '"Play music"',
              '"Open calculator"',
              '"Open camera"'
            ].map((command, index) => (
              <span 
                key={index}
                className={`px-3 py-1 rounded-full text-xs border transition-all duration-500 ${
                  isDarkMode
                    ? 'bg-gray-700/50 text-cyan-300 border-cyan-500/30'
                    : 'bg-blue-50 text-blue-700 border-blue-300'
                }`}
              >
                {command}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceCommand;