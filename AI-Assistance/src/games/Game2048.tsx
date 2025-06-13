import React, { useState, useEffect, useCallback } from 'react';
import { RotateCcw, Trophy } from 'lucide-react';

type Board = number[][];

const Game2048: React.FC = () => {
  const [board, setBoard] = useState<Board>(() => 
    Array(4).fill(null).map(() => Array(4).fill(0))
  );
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    const saved = localStorage.getItem('2048-best-score');
    return saved ? parseInt(saved) : 0;
  });
  const [gameWon, setGameWon] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const addRandomTile = (newBoard: Board) => {
    const emptyCells: [number, number][] = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (newBoard[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }
    
    if (emptyCells.length > 0) {
      const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      const [row, col] = randomCell;
      newBoard[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
    
    return newBoard;
  };

  const initializeGame = () => {
    let newBoard: Board = Array(4).fill(null).map(() => Array(4).fill(0));
    newBoard = addRandomTile(newBoard);
    newBoard = addRandomTile(newBoard);
    setBoard(newBoard);
    setScore(0);
    setGameWon(false);
    setGameOver(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const rotateBoard = (board: Board) => {
    return board[0].map((_, index) => board.map(row => row[index]).reverse());
  };

  const slideRow = (row: number[]) => {
    const filtered = row.filter(val => val !== 0);
    const missing = 4 - filtered.length;
    const zeros = Array(missing).fill(0);
    return filtered.concat(zeros);
  };

  const combineRow = (row: number[]) => {
    let newScore = 0;
    for (let i = 0; i < 3; i++) {
      if (row[i] !== 0 && row[i] === row[i + 1]) {
        row[i] *= 2;
        row[i + 1] = 0;
        newScore += row[i];
        if (row[i] === 2048 && !gameWon) {
          setGameWon(true);
        }
      }
    }
    return { row: slideRow(row), score: newScore };
  };

  const moveLeft = (board: Board) => {
    let newScore = 0;
    const newBoard = board.map(row => {
      const slid = slideRow(row);
      const combined = combineRow(slid);
      newScore += combined.score;
      return combined.row;
    });
    return { board: newBoard, score: newScore };
  };

  const moveRight = (board: Board) => {
    const newBoard = board.map(row => {
      const reversed = row.slice().reverse();
      const slid = slideRow(reversed);
      const combined = combineRow(slid);
      return combined.row.reverse();
    });
    let newScore = 0;
    board.forEach((row, i) => {
      const reversed = row.slice().reverse();
      const slid = slideRow(reversed);
      const combined = combineRow(slid);
      newScore += combined.score;
    });
    return { board: newBoard, score: newScore };
  };

  const moveUp = (board: Board) => {
    const rotated = rotateBoard(rotateBoard(rotateBoard(board)));
    const moved = moveLeft(rotated);
    return { 
      board: rotateBoard(moved.board), 
      score: moved.score 
    };
  };

  const moveDown = (board: Board) => {
    const rotated = rotateBoard(board);
    const moved = moveLeft(rotated);
    return { 
      board: rotateBoard(rotateBoard(rotateBoard(moved.board))), 
      score: moved.score 
    };
  };

  const boardsEqual = (board1: Board, board2: Board) => {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board1[i][j] !== board2[i][j]) {
          return false;
        }
      }
    }
    return true;
  };

  const canMove = (board: Board) => {
    // Check for empty cells
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === 0) return true;
      }
    }
    
    // Check for possible merges
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === board[i][j + 1]) return true;
      }
    }
    
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === board[i + 1][j]) return true;
      }
    }
    
    return false;
  };

  const handleMove = useCallback((direction: 'left' | 'right' | 'up' | 'down') => {
    if (gameOver) return;

    let result;
    switch (direction) {
      case 'left':
        result = moveLeft(board);
        break;
      case 'right':
        result = moveRight(board);
        break;
      case 'up':
        result = moveUp(board);
        break;
      case 'down':
        result = moveDown(board);
        break;
    }

    if (!boardsEqual(board, result.board)) {
      const newBoard = addRandomTile(result.board.map(row => [...row]));
      setBoard(newBoard);
      const newScore = score + result.score;
      setScore(newScore);
      
      if (newScore > bestScore) {
        setBestScore(newScore);
        localStorage.setItem('2048-best-score', newScore.toString());
      }
      
      if (!canMove(newBoard)) {
        setGameOver(true);
      }
    }
  }, [board, score, bestScore, gameOver]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          handleMove('left');
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleMove('right');
          break;
        case 'ArrowUp':
          e.preventDefault();
          handleMove('up');
          break;
        case 'ArrowDown':
          e.preventDefault();
          handleMove('down');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleMove]);

  const getTileColor = (value: number) => {
    const colors: { [key: number]: string } = {
      0: 'bg-gray-700',
      2: 'bg-blue-200 text-gray-800',
      4: 'bg-blue-300 text-gray-800',
      8: 'bg-orange-300 text-white',
      16: 'bg-orange-400 text-white',
      32: 'bg-red-400 text-white',
      64: 'bg-red-500 text-white',
      128: 'bg-yellow-400 text-white',
      256: 'bg-yellow-500 text-white',
      512: 'bg-purple-400 text-white',
      1024: 'bg-purple-500 text-white',
      2048: 'bg-green-500 text-white'
    };
    return colors[value] || 'bg-pink-500 text-white';
  };

  return (
    <div className="text-center max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <div className="bg-gray-800 px-3 py-2 rounded-lg">
            <div className="text-cyan-400 text-sm">Score</div>
            <div className="text-white font-bold">{score}</div>
          </div>
          <div className="bg-gray-800 px-3 py-2 rounded-lg">
            <div className="text-yellow-400 text-sm">Best</div>
            <div className="text-white font-bold">{bestScore}</div>
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

      <div className="bg-gray-800 p-4 rounded-lg relative">
        <div className="grid grid-cols-4 gap-2">
          {board.flat().map((value, index) => (
            <div
              key={index}
              className={`
                w-16 h-16 rounded-lg flex items-center justify-center font-bold
                transition-all duration-200 transform
                ${getTileColor(value)}
                ${value > 0 ? 'scale-100' : 'scale-95'}
              `}
            >
              {value > 0 && (
                <span className={value > 999 ? 'text-sm' : 'text-lg'}>
                  {value}
                </span>
              )}
            </div>
          ))}
        </div>

        {gameWon && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-lg">
            <div className="bg-green-900/90 p-6 rounded-lg text-center border border-green-400">
              <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-green-400 mb-2">You Win!</h3>
              <p className="text-white mb-4">You reached 2048!</p>
              <button
                onClick={() => setGameWon(false)}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors mr-2"
              >
                Continue
              </button>
              <button
                onClick={initializeGame}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
              >
                New Game
              </button>
            </div>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-lg">
            <div className="bg-red-900/90 p-6 rounded-lg text-center border border-red-400">
              <h3 className="text-2xl font-bold text-red-400 mb-2">Game Over!</h3>
              <p className="text-white mb-4">Final Score: {score}</p>
              <button
                onClick={initializeGame}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-400">
        Use arrow keys to move tiles
      </div>
    </div>
  );
};

export default Game2048;