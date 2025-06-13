import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

const TetrisGame: React.FC = () => {
  const BOARD_WIDTH = 10;
  const BOARD_HEIGHT = 20;
  
  const [board, setBoard] = useState<number[][]>(() => 
    Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0))
  );
  const [currentPiece, setCurrentPiece] = useState<any>(null);
  const [gameRunning, setGameRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [linesCleared, setLinesCleared] = useState(0);

  const pieces = [
    { shape: [[1, 1, 1, 1]], color: 1 }, // I
    { shape: [[1, 1], [1, 1]], color: 2 }, // O
    { shape: [[0, 1, 0], [1, 1, 1]], color: 3 }, // T
    { shape: [[0, 1, 1], [1, 1, 0]], color: 4 }, // S
    { shape: [[1, 1, 0], [0, 1, 1]], color: 5 }, // Z
    { shape: [[1, 0, 0], [1, 1, 1]], color: 6 }, // J
    { shape: [[0, 0, 1], [1, 1, 1]], color: 7 }, // L
  ];

  const getRandomPiece = () => {
    const piece = pieces[Math.floor(Math.random() * pieces.length)];
    return {
      ...piece,
      x: Math.floor(BOARD_WIDTH / 2) - 1,
      y: 0
    };
  };

  const isValidMove = (piece: any, dx = 0, dy = 0, newShape?: number[][]) => {
    const shape = newShape || piece.shape;
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const newX = piece.x + x + dx;
          const newY = piece.y + y + dy;
          
          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
            return false;
          }
          if (newY >= 0 && board[newY][newX]) {
            return false;
          }
        }
      }
    }
    return true;
  };

  const rotatePiece = (shape: number[][]) => {
    const newShape = Array(shape[0].length).fill(null).map(() => Array(shape.length).fill(0));
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        newShape[x][shape.length - 1 - y] = shape[y][x];
      }
    }
    return newShape;
  };

  const placePiece = useCallback(() => {
    if (!currentPiece) return;

    const newBoard = board.map(row => [...row]);
    currentPiece.shape.forEach((row: number[], y: number) => {
      row.forEach((cell, x) => {
        if (cell) {
          newBoard[currentPiece.y + y][currentPiece.x + x] = currentPiece.color;
        }
      });
    });

    // Clear completed lines
    let clearedLines = 0;
    for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
      if (newBoard[y].every(cell => cell !== 0)) {
        newBoard.splice(y, 1);
        newBoard.unshift(Array(BOARD_WIDTH).fill(0));
        clearedLines++;
        y++; // Check the same line again
      }
    }

    if (clearedLines > 0) {
      setLinesCleared(prev => prev + clearedLines);
      setScore(prev => prev + clearedLines * 100 * level);
      setLevel(Math.floor(linesCleared / 10) + 1);
    }

    setBoard(newBoard);
    setCurrentPiece(getRandomPiece());
  }, [currentPiece, board, level, linesCleared]);

  const moveDown = useCallback(() => {
    if (!currentPiece || !gameRunning) return;

    if (isValidMove(currentPiece, 0, 1)) {
      setCurrentPiece(prev => ({ ...prev, y: prev.y + 1 }));
    } else {
      placePiece();
    }
  }, [currentPiece, gameRunning, isValidMove, placePiece]);

  useEffect(() => {
    if (!gameRunning) return;
    
    const interval = setInterval(moveDown, Math.max(100, 600 - level * 50));
    return () => clearInterval(interval);
  }, [moveDown, gameRunning, level]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameRunning || !currentPiece) return;

      switch (e.key) {
        case 'ArrowLeft':
          if (isValidMove(currentPiece, -1, 0)) {
            setCurrentPiece(prev => ({ ...prev, x: prev.x - 1 }));
          }
          break;
        case 'ArrowRight':
          if (isValidMove(currentPiece, 1, 0)) {
            setCurrentPiece(prev => ({ ...prev, x: prev.x + 1 }));
          }
          break;
        case 'ArrowDown':
          moveDown();
          break;
        case 'ArrowUp':
        case ' ':
          const rotated = rotatePiece(currentPiece.shape);
          if (isValidMove(currentPiece, 0, 0, rotated)) {
            setCurrentPiece(prev => ({ ...prev, shape: rotated }));
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameRunning, currentPiece, isValidMove, moveDown]);

  const startGame = () => {
    setBoard(Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0)));
    setCurrentPiece(getRandomPiece());
    setScore(0);
    setLevel(1);
    setLinesCleared(0);
    setGameRunning(true);
  };

  const getDisplayBoard = () => {
    const displayBoard = board.map(row => [...row]);
    
    if (currentPiece) {
      currentPiece.shape.forEach((row: number[], y: number) => {
        row.forEach((cell, x) => {
          if (cell && currentPiece.y + y >= 0) {
            displayBoard[currentPiece.y + y][currentPiece.x + x] = currentPiece.color;
          }
        });
      });
    }
    
    return displayBoard;
  };

  const colors = [
    'bg-gray-900', // 0 - empty
    'bg-cyan-400', // 1 - I
    'bg-yellow-400', // 2 - O  
    'bg-purple-400', // 3 - T
    'bg-green-400', // 4 - S
    'bg-red-400', // 5 - Z
    'bg-blue-400', // 6 - J
    'bg-orange-400', // 7 - L
  ];

  return (
    <div className="flex gap-6 justify-center">
      <div>
        <div className="bg-gray-900 p-2 rounded-lg border-2 border-cyan-500/50 inline-block">
          <div 
            className="grid gap-0.5"
            style={{ gridTemplateColumns: `repeat(${BOARD_WIDTH}, 1fr)` }}
          >
            {getDisplayBoard().flat().map((cell, index) => (
              <div
                key={index}
                className={`w-6 h-6 border border-gray-700 ${colors[cell]}`}
              />
            ))}
          </div>
        </div>
        
        <div className="mt-4 text-center text-sm text-gray-400">
          Use arrow keys to move and rotate
        </div>
      </div>

      <div className="text-left space-y-4">
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-cyan-400 font-bold">Score: {score}</div>
          <div className="text-green-400">Level: {level}</div>
          <div className="text-purple-400">Lines: {linesCleared}</div>
        </div>

        <div className="space-y-2">
          <button
            onClick={gameRunning ? () => setGameRunning(false) : startGame}
            className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {gameRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {gameRunning ? 'Pause' : 'Start'}
          </button>
          
          <button
            onClick={startGame}
            className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            New Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default TetrisGame;