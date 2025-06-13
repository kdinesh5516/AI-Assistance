import React, { useState, useEffect } from 'react';
import { RotateCcw, Trophy } from 'lucide-react';

interface Card {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const MemoryGame: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);

  const emojis = ['🎮', '🚀', '⭐', '🎯', '🔥', '💎', '🌟', '⚡'];

  const initializeGame = () => {
    const gameCards: Card[] = [];
    emojis.forEach((emoji, index) => {
      gameCards.push(
        { id: index * 2, value: emoji, isFlipped: false, isMatched: false },
        { id: index * 2 + 1, value: emoji, isFlipped: false, isMatched: false }
      );
    });
    
    // Shuffle cards
    for (let i = gameCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [gameCards[i], gameCards[j]] = [gameCards[j], gameCards[i]];
    }
    
    setCards(gameCards);
    setFlippedCards([]);
    setMatches(0);
    setMoves(0);
    setGameComplete(false);
    setStartTime(Date.now());
    setEndTime(null);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards;
      const firstCard = cards.find(card => card.id === first);
      const secondCard = cards.find(card => card.id === second);
      
      setMoves(prev => prev + 1);
      
      if (firstCard?.value === secondCard?.value) {
        // Match found
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === first || card.id === second 
              ? { ...card, isMatched: true } 
              : card
          ));
          setMatches(prev => prev + 1);
          setFlippedCards([]);
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === first || card.id === second 
              ? { ...card, isFlipped: false } 
              : card
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  }, [flippedCards, cards]);

  useEffect(() => {
    if (matches === emojis.length) {
      setGameComplete(true);
      setEndTime(Date.now());
    }
  }, [matches]);

  const handleCardClick = (cardId: number) => {
    if (flippedCards.length >= 2) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;
    
    setCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    ));
    setFlippedCards(prev => [...prev, cardId]);
  };

  const getGameTime = () => {
    if (!startTime) return 0;
    const end = endTime || Date.now();
    return Math.floor((end - startTime) / 1000);
  };

  return (
    <div className="text-center max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <div className="bg-gray-800 px-3 py-1 rounded-lg">
            <span className="text-cyan-400">Moves: {moves}</span>
          </div>
          <div className="bg-gray-800 px-3 py-1 rounded-lg">
            <span className="text-green-400">Matches: {matches}/{emojis.length}</span>
          </div>
          <div className="bg-gray-800 px-3 py-1 rounded-lg">
            <span className="text-purple-400">Time: {getGameTime()}s</span>
          </div>
        </div>
        
        <button
          onClick={initializeGame}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          New Game
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-6">
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={`
              relative w-20 h-20 cursor-pointer transition-all duration-300 transform
              ${card.isMatched ? 'scale-105' : 'hover:scale-105'}
            `}
          >
            <div className={`
              w-full h-full rounded-lg border-2 transition-all duration-500
              ${card.isFlipped || card.isMatched 
                ? 'bg-gradient-to-br from-cyan-400 to-blue-500 border-cyan-300' 
                : 'bg-gray-700 border-gray-600 hover:border-cyan-500'
              }
              ${card.isMatched ? 'ring-2 ring-green-400' : ''}
            `}>
              <div className={`
                w-full h-full flex items-center justify-center text-2xl
                transition-opacity duration-300
                ${card.isFlipped || card.isMatched ? 'opacity-100' : 'opacity-0'}
              `}>
                {card.value}
              </div>
              
              {!card.isFlipped && !card.isMatched && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-lg">
                  ?
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {gameComplete && (
        <div className="bg-gradient-to-br from-green-900/50 to-blue-900/50 border border-green-400 rounded-lg p-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Trophy className="w-8 h-8 text-yellow-400" />
            <h3 className="text-2xl font-bold text-green-400">Congratulations!</h3>
          </div>
          <p className="text-white mb-2">You completed the game in:</p>
          <div className="flex justify-center gap-4 text-lg">
            <span className="text-cyan-400">{moves} moves</span>
            <span className="text-purple-400">{getGameTime()} seconds</span>
          </div>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-400">
        Click cards to flip them and find matching pairs
      </div>
    </div>
  );
};

export default MemoryGame;