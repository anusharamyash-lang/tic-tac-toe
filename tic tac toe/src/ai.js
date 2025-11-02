export const checkWinner = (b) => {
  const winningCombos = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (let [a,b1,c] of winningCombos) {
    if (b[a] && b[a] === b[b1] && b[a] === b[c]) return b[a];
  }
  return b.every(cell => cell) ? 'Draw' : null;
};

export const getComputerMove = (board, difficulty) => {
  const emptyIndices = board.map((val, i) => val ? null : i).filter(i => i !== null);

  if (difficulty === 'Easy') {
    return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  }

  if (difficulty === 'Medium') {
    const player = 'X';
    for (let i of emptyIndices) {
      const testBoard = [...board];
      testBoard[i] = player;
      if (checkWinner(testBoard) === player) return i;
    }
    return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  }

  if (difficulty === 'Difficult') {
    return minimaxMove(board, 'O').index;
  }

  return null;
};

// Minimax algorithm for Difficult level
const minimaxMove = (newBoard, player) => {
  const availSpots = newBoard.map((val, i) => val ? null : i).filter(i => i !== null);
  const winner = checkWinner(newBoard);
  if (winner === 'X') return { score: -10 };
  if (winner === 'O') return { score: 10 };
  if (winner === 'Draw') return { score: 0 };

  const moves = [];

  for (let i of availSpots) {
    const move = {};
    move.index = i;
    newBoard[i] = player;

    const result = minimaxMove(newBoard, player === 'O' ? 'X' : 'O');
    move.score = result.score;

    newBoard[i] = null;
    moves.push(move);
  }

  let bestMove;
  if (player === 'O') {
    let bestScore = -Infinity;
    for (let m of moves) {
      if (m.score > bestScore) {
        bestScore = m.score;
        bestMove = m;
      }
    }
  } else {
    let bestScore = Infinity;
    for (let m of moves) {
      if (m.score < bestScore) {
        bestScore = m.score;
        bestMove = m;
      }
    }
  }

  return bestMove;
};