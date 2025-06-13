import React, { useState, useEffect, useCallback } from 'react';
import { Play, RotateCcw } from 'lucide-react';

interface Pipe {
  x: number;
  height: number;
  passed: boolean;
}

const FlappyBirdGame: React.FC = () => {
  const [birdY, setBirdY] = useState(250);
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [pipes, setPipes] = useState<Pipe[]>([]);
  const [gameRunning, setGameRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const BIRD_SIZE = 30;
  const PIPE_WIDTH = 60;
  const PIPE_GAP = 150;
  const GAME_WIDTH = 600;
  const GAME_HEIGHT = 500;
  const GRAVITY = 0.5;
  const JUMP_FORCE = -10;

  const jump = useCallback(() => {
    if (gameRunning && !gameOver) {
      setBirdVelocity(JUMP_FORCE);
    }
  }, [gameRunning, gameOver]);

  const resetGame = () => {
    setBirdY(250);
    setBirdVelocity(0);
    setPipes([]);
    setScore(0);
    setGameOver(false);
    setGameRunning(false);
  };

  const startGame = () => {
    resetGame();
    setGameRunning(true);
    setPipes([{ x: GAME_WIDTH, height: Math.random() * 200 + 100, passed: false }]);
  };

  useEffect(() => {
    if (!gameRunning || gameOver) return;

    const gameLoop = setInterval(() => {
      // Update bird physics
      setBirdVelocity(prev => prev + GRAVITY);
      setBirdY(prev => {
        const newY = prev + birdVelocity;
        
        // Check ground/ceiling collision
        if (newY <= 0 || newY >= GAME_HEIGHT - BIRD_SIZE) {
          setGameOver(true);
          setGameRunning(false);
          return prev;
        }
        
        return newY;
      });

      // Update pipes
      setPipes(prevPipes => {
        const newPipes = prevPipes.map(pipe => ({
          ...pipe,
          x: pipe.x - 3
        })).filter(pipe => pipe.x > -PIPE_WIDTH);

        // Add new pipe
        if (newPipes.length === 0 || newPipes[newPipes.length - 1].x < GAME_WIDTH - 300) {
          newPipes.push({
            x: GAME_WIDTH,
            height: Math.random() * 200 + 100,
            passed: false
          });
        }

        // Check collisions and scoring
        newPipes.forEach(pipe => {
          const birdLeft = 100;
          const birdRight = birdLeft + BIRD_SIZE;
          const birdTop = birdY;
          const birdBottom = birdY + BIRD_SIZE;
          
          const pipeLeft = pipe.x;
          const pipeRight = pipe.x + PIPE_WIDTH;
          
          // Check collision
          if (birdRight > pipeLeft && birdLeft < pipeRight) {
            if (birdTop < pipe.height || birdBottom > pipe.height + PIPE_GAP) {
              setGameOver(true);
              setGameRunning(false);
            }
          }
          
          // Check scoring
          if (!pipe.passed && pipe.x + PIPE_WIDTH < birdLeft) {
            pipe.passed = true;
            setScore(prev => prev + 1);
          }
        });

        return newPipes;
      });
    }, 20);

    return () => clearInterval(gameLoop);
  }, [gameRunning, gameOver, birdY, birdVelocity]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === 'ArrowUp') {
        e.preventDefault();
        jump();
      }
    };

    const handleClick = () => {
      jump();
    };

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('click', handleClick);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('click', handleClick);
    };
  }, [jump]);

  return (
    <div className="text-center">
      <div className="flex justify-between items-center mb-4">
        <div className="text-cyan-400">
          <span className="text-lg font-bold">Score: {score}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={startGame}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            {gameRunning ? 'Restart' : 'Start'}
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

      <div 
        className="relative mx-auto bg-gradient-to-b from-cyan-400 to-blue-600 border-4 border-cyan-500 rounded-lg overflow-hidden cursor-pointer"
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
        onClick={jump}
      >
        {/* Bird */}
        <div
          className="absolute w-8 h-8 bg-yellow-400 rounded-full border-2 border-orange-500 transition-all duration-75"
          style={{
            left: 100,
            top: birdY,
            transform: `rotate(${Math.min(Math.max(birdVelocity * 3, -30), 30)}deg)`
          }}
        >
          <div className="absolute inset-1 bg-yellow-300 rounded-full" />
          <div className="absolute top-1 left-2 w-2 h-2 bg-black rounded-full" />
        </div>

        {/* Pipes */}
        {pipes.map((pipe, index) => (
          <div key={index}>
            {/* Top pipe */}
            <div
              className="absolute bg-green-500 border-2 border-green-600"
              style={{
                left: pipe.x,
                top: 0,
                width: PIPE_WIDTH,
                height: pipe.height
              }}
            />
            {/* Bottom pipe */}
            <div
              className="absolute bg-green-500 border-2 border-green-600"
              style={{
                left: pipe.x,
                top: pipe.height + PIPE_GAP,
                width: PIPE_WIDTH,
                height: GAME_HEIGHT - pipe.height - PIPE_GAP
              }}
            />
          </div>
        ))}

        {/* Ground */}
        <div className="absolute bottom-0 w-full h-4 bg-green-600" />

        {gameOver && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            <div className="bg-gray-900 p-6 rounded-lg border border-red-500 text-center">
              <h3 className="text-2xl font-bold text-red-400 mb-2">Game Over!</h3>
              <p className="text-white mb-4">Score: {score}</p>
              <button
                onClick={startGame}
                className="px-6 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors"
              >
                Play Again
              </button>
            </div>
          </div>
        )}

        {!gameRunning && !gameOver && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center text-white">
              <h3 className="text-2xl font-bold mb-4">🐤 Flappy Bird</h3>
              <p className="mb-4">Click or press Space to jump!</p>
              <button
                onClick={startGame}
                className="px-6 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors"
              >
                Start Game
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-400">
        Click anywhere or press Space to jump
      </div>
    </div>
  );
};

export default FlappyBirdGame;