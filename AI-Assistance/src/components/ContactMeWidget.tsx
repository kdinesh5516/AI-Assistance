import React, { useState } from 'react';
import { MessageCircle, X, Mail, User } from 'lucide-react';

interface ContactMeWidgetProps {
  isDarkMode: boolean;
}

const ContactMeWidget: React.FC<ContactMeWidgetProps> = ({ isDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<Array<{type: 'user' | 'bot', message: string}>>([]);

  const handleQuestionClick = (question: string) => {
    setCurrentQuestion(question);
    setChatHistory(prev => [...prev, { type: 'user', message: question }]);
    
    let response = '';
    if (question.toLowerCase().includes('name')) {
      response = "I am K. Dinesh Reddy, your assistant creator! 👨‍💻";
    } else if (question.toLowerCase().includes('contact')) {
      response = "Mail: kdineshreddy744@gmail.com 📧";
    } else {
      response = "For more details, kindly reach me at my email! 💌";
    }
    
    setTimeout(() => {
      setChatHistory(prev => [...prev, { type: 'bot', message: response }]);
    }, 500);
  };

  const predefinedQuestions = [
    "What's your name?",
    "How to contact you?",
    "Tell me about yourself"
  ];

  return (
    <>
      {/* Contact Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full transition-all duration-300 transform hover:scale-110 ${
          isDarkMode
            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70'
            : 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70'
        }`}
      >
        <div className="relative">
          <MessageCircle className="w-6 h-6 text-white" />
          
          {/* Pulsing ring */}
          <div className={`absolute inset-0 rounded-full animate-ping ${
            isDarkMode ? 'bg-cyan-400' : 'bg-blue-400'
          } opacity-30`} />
          
          {/* Neon glow effect */}
          <div className={`absolute inset-0 rounded-full blur-sm ${
            isDarkMode 
              ? 'bg-gradient-to-r from-cyan-400 to-blue-500' 
              : 'bg-gradient-to-r from-blue-400 to-purple-500'
          } opacity-50`} />
        </div>
      </button>

      {/* Contact Widget Panel */}
      {isOpen && (
        <div className={`fixed bottom-24 right-6 z-50 w-80 max-w-[calc(100vw-3rem)] rounded-2xl border transition-all duration-300 transform ${
          isDarkMode
            ? 'bg-black/90 border-cyan-500/30 backdrop-blur-sm'
            : 'bg-white/90 border-blue-300 backdrop-blur-sm shadow-xl'
        }`}>
          {/* Header */}
          <div className={`flex items-center justify-between p-4 border-b ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600' 
                  : 'bg-gradient-to-r from-blue-500 to-purple-600'
              }`}>
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Contact Me
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  K. Dinesh Reddy
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className={`p-1 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                  : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Area */}
          <div className="p-4 max-h-64 overflow-y-auto">
            {chatHistory.length === 0 ? (
              <div className={`text-center py-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <p className="mb-4">👋 Hi! Ask me anything:</p>
              </div>
            ) : (
              <div className="space-y-3">
                {chatHistory.map((chat, index) => (
                  <div
                    key={index}
                    className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        chat.type === 'user'
                          ? isDarkMode
                            ? 'bg-cyan-600 text-white'
                            : 'bg-blue-500 text-white'
                          : isDarkMode
                            ? 'bg-gray-700 text-gray-100'
                            : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      {chat.message}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Questions */}
          <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="space-y-2">
              {predefinedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuestionClick(question)}
                  className={`w-full text-left p-2 rounded-lg text-sm transition-colors ${
                    isDarkMode
                      ? 'hover:bg-gray-700 text-gray-300 hover:text-white'
                      : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
                  }`}
                >
                  {question}
                </button>
              ))}
            </div>
            
            {/* Direct Email Link */}
            <div className="mt-4 pt-3 border-t border-gray-600">
              <a
                href="mailto:kdineshreddy744@gmail.com"
                className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                  isDarkMode
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 hover:from-cyan-500/30 hover:to-blue-500/30'
                    : 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-600 hover:from-blue-500/30 hover:to-purple-500/30'
                }`}
              >
                <Mail className="w-4 h-4" />
                <span className="text-sm">kdineshreddy744@gmail.com</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ContactMeWidget;