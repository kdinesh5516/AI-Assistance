import React, { useState } from 'react';
import { RotateCcw, User, Bot } from 'lucide-react';

type Player = 'X' | 'O' | null;

const TicTacToeGame: React.FC = () => {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [winner, setWinner] = useState<Player | 'tie' | null>(null);
  const [vsAI, setVsAI] = useState(false);

  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
  ];

  const checkWinner = (squares: Player[]) => {
    for (const combo of winningCombinations) {
      const [a, b, c] = combo;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return squares.every(square => square !== null) ? 'tie' : null;
  };

  const makeMove = (index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      return;
    }

    const nextPlayer = currentPlayer === 'X' ? 'O' : 'X';
    setCurrentPlayer(nextPlayer);

    // AI move
    if (vsAI && nextPlayer === 'O' && !gameWinner) {
      setTimeout(() => makeAIMove(newBoard), 500);
    }
  };

  const makeAIMove = (currentBoard: Player[]) => {
    const availableMoves = currentBoard
      .map((square, index) => square === null ? index : null)
      .filter(val => val !== null) as number[];

    if (availableMoves.length === 0) return;

    // Simple AI: try to win, then block, then random
    const aiMove = getBestMove(currentBoard, availableMoves);
    const newBoard = [...currentBoard];
    newBoard[aiMove] = 'O';
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
    } else {
      setCurrentPlayer('X');
    }
  };

  const getBestMove = (currentBoard: Player[], availableMoves: number[]) => {
    // Check if AI can win
    for (const move of availableMoves) {
      const testBoard = [...currentBoard];
      testBoard[move] = 'O';
      if (checkWinner(testBoard) === 'O') {
        return move;
      }
    }

    // Check if need to block player
    for (const move of availableMoves) {
      const testBoard = [...currentBoard];
      testBoard[move] = 'X';
      if (checkWinner(testBoard) === 'X') {
        return move;
      }
    }

    // Take center if available
    if (availableMoves.includes(4)) {
      return 4;
    }

    // Take corners
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(corner => availableMoves.includes(corner));
    if (availableCorners.length > 0) {
      return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }

    // Random move
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
  };

  const toggleGameMode = () => {
    setVsAI(!vsAI);
    resetGame();
  };

  return (
    <div className="text-center max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleGameMode}
            className={`px-3 py-1 rounded-lg transition-colors ${
              vsAI 
                ? 'bg-purple-500 text-white' 
                : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
            }`}
          >
            {vsAI ? (
              <>
                <Bot className="w-4 h-4 inline mr-1" />
                vs AI
              </>
            ) : (
              <>
                <User className="w-4 h-4 inline mr-1" />
                vs Player
              </>
            )}
          </button>
        </div>
        
        <button
          onClick={resetGame}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-6 bg-gray-800 p-4 rounded-lg">
        {board.map((square, index) => (
          <button
            key={index}
            onClick={() => makeMove(index)}
            className={`
              w-20 h-20 bg-gray-700 border-2 border-gray-600 rounded-lg
              text-3xl font-bold transition-all duration-200 hover:bg-gray-600
              ${square === 'X' ? 'text-cyan-400' : 'text-pink-400'}
              ${!square && !winner ? 'hover:border-cyan-400' : ''}
            `}
            disabled={!!square || !!winner}
          >
            {square}
          </button>
        ))}
      </div>

      <div className="text-center">
        {winner ? (
          <div className="bg-gray-800 p-4 rounded-lg">
            {winner === 'tie' ? (
              <p className="text-yellow-400 text-xl font-bold">It's a tie! 🤝</p>
            ) : (
              <p className="text-green-400 text-xl font-bold">
                {winner === 'X' ? '🎉 Player X Wins!' : 
                 vsAI ? '🤖 AI Wins!' : '🎉 Player O Wins!'}
              </p>
            )}
          </div>
        ) : (
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-white text-lg">
              Current turn: 
              <span className={`font-bold ml-2 ${
                currentPlayer === 'X' ? 'text-cyan-400' : 'text-pink-400'
              }`}>
                {currentPlayer === 'X' ? 'Player X' : 
                 vsAI ? 'AI (O)' : 'Player O'}
              </span>
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-400">
        {vsAI ? 'You are X, AI is O' : 'Take turns placing X and O'}
      </div>
    </div>
  );
};

export default TicTacToeGame;