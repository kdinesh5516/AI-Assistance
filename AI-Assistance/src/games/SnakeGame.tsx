import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface Position {
  x: number;
  y: number;
}

const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Position>({ x: 1, y: 0 });
  const [gameRunning, setGameRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const BOARD_SIZE = 20;

  const generateFood = useCallback(() => {
    return {
      x: Math.floor(Math.random() * BOARD_SIZE),
      y: Math.floor(Math.random() * BOARD_SIZE)
    };
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood());
    setDirection({ x: 1, y: 0 });
    setScore(0);
    setGameOver(false);
    setGameRunning(false);
  };

  const moveSnake = useCallback(() => {
    if (!gameRunning || gameOver) return;

    setSnake(prevSnake => {
      const newSnake = [...prevSnake];
      const head = { ...newSnake[0] };
      
      head.x += direction.x;
      head.y += direction.y;

      // Check wall collision
      if (head.x < 0 || head.x >= BOARD_SIZE || head.y < 0 || head.y >= BOARD_SIZE) {
        setGameOver(true);
        setGameRunning(false);
        return prevSnake;
      }

      // Check self collision
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        setGameRunning(false);
        return prevSnake;
      }

      newSnake.unshift(head);

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setScore(prevScore => prevScore + 10);
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [gameRunning, gameOver, direction, food, generateFood]);

  useEffect(() => {
    const gameInterval = setInterval(moveSnake, 150);
    return () => clearInterval(gameInterval);
  }, [moveSnake]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameRunning) return;

      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameRunning, direction]);

  return (
    <div className="text-center">
      <div className="flex justify-between items-center mb-4">
        <div className="text-cyan-400">
          <span className="text-lg font-bold">Score: {score}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setGameRunning(!gameRunning)}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors flex items-center gap-2"
            disabled={gameOver}
          >
            {gameRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {gameRunning ? 'Pause' : 'Play'}
          </button>
          <button
            onClick={resetGame}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>

      <div className="inline-block bg-gray-900 p-4 rounded-lg border-2 border-cyan-500/50">
        <div 
          className="grid gap-0 bg-black"
          style={{ 
            gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
            width: '400px',
            height: '400px'
          }}
        >
          {Array.from({ length: BOARD_SIZE * BOARD_SIZE }).map((_, index) => {
            const x = index % BOARD_SIZE;
            const y = Math.floor(index / BOARD_SIZE);
            
            const isSnake = snake.some(segment => segment.x === x && segment.y === y);
            const isHead = snake[0]?.x === x && snake[0]?.y === y;
            const isFood = food.x === x && food.y === y;

            return (
              <div
                key={index}
                className={`
                  border border-gray-800 flex items-center justify-center text-xs
                  ${isHead ? 'bg-green-400' : ''}
                  ${isSnake && !isHead ? 'bg-green-600' : ''}
                  ${isFood ? 'bg-red-500' : ''}
                `}
              >
                {isFood && '🍎'}
              </div>
            );
          })}
        </div>
      </div>

      {gameOver && (
        <div className="mt-4 p-4 bg-red-900/50 border border-red-500 rounded-lg">
          <h3 className="text-xl font-bold text-red-400 mb-2">Game Over!</h3>
          <p className="text-white">Final Score: {score}</p>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-400">
        Use arrow keys to control the snake
      </div>
    </div>
  );
};

export default SnakeGame;