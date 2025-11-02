import React, { useState, useEffect } from 'react';
import './styles/app.css';
import { getComputerMove } from './logic/ai';
import confetti from 'canvas-confetti';
const App = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [difficulty, setDifficulty] = useState('Easy');

  const winningCombos = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  const checkWinner = (b) => {
    for (let [a,b1,c] of winningCombos) {
      if (b[a] && b[a] === b[b1] && b[a] === b[c]) return b[a];
    }
    return b.every(cell => cell) ? 'Draw' : null;
  };

  const handleClick = (i) => {
    if (!isPlayerTurn || board[i] || winner) return;
    const newBoard = [...board];
    newBoard[i] = 'X';
    setBoard(newBoard);
    setIsPlayerTurn(false);
  };

  useEffect(() => {
  const result = checkWinner(board);
  if (result) {
    setWinner(result);
    setGamesPlayed(prev => prev + 1);
    if (result === 'X') {
      setPlayerScore(prev => prev + 1);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      }); // 🎉 throw papers!
    } else if (result === 'O') {
      setComputerScore(prev => prev + 1);
    }
  } else if (!isPlayerTurn) {
    const move = getComputerMove(board, difficulty);
    if (move !== null) {
      setTimeout(() => {
        const newBoard = [...board];
        newBoard[move] = 'O';
        setBoard(newBoard);
        setIsPlayerTurn(true);
      }, 500);
    }
  }
}, [board, isPlayerTurn, difficulty]);
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setWinner(null);
  };

  return (
    <div className="game">
      <h1>Tic-Tac-Toe: You vs Computer</h1>
      <div className="difficulty">
        <label>Select Difficulty: </label>
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Difficult">Difficult</option>
        </select>
      </div>
      <div className="board">
        {board.map((val, i) => (
          <button key={i} onClick={() => handleClick(i)}>{val}</button>
        ))}
      </div>
      <h2>{winner ? `Result: ${winner}` : `Your Turn`}</h2>
      <button onClick={resetGame}>Reset</button>

      <div className="leaderboard">
        <h2>Leaderboard</h2>
        <table>
          <thead>
            <tr>
              <th>Player</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>You (X)</td>
              <td>{playerScore}</td>
            </tr>
            <tr>
              <td>Computer (O)</td>
              <td>{computerScore}</td>
            </tr>
          </tbody>
        </table>
        <p>Total Games Played: {gamesPlayed}</p>
      </div>
    </div>
  );
};

export default App;