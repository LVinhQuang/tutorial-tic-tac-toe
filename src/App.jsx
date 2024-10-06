import { useState } from 'react';

function Square({ _id, value, onSquareClick }) {
  return (
    <button id={_id} className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winnerResult = calculateWinner(squares);
  let status;
  let square_elements = document.getElementsByClassName('square');
  
  if (winnerResult != null) {
    status = 'Winner: ' + winnerResult[0];
    winnerResult[1].forEach(value => {
      square_elements[value].style.color = 'red';
    })
  } else {
    for (let i =0; i< 9; i++) {
      if (square_elements.length > 0) {
        square_elements[i].style.color = 'black';
      }
    }
    if (squares.includes(null)) {
      status = 'Next player: ' + (xIsNext ? 'X' : 'O');
    }
    else {
      status = 'DRAW !!!!!!!!!!'
    }
  }

  //Rewrite the Board to use two loops to make the squares instead of hardcoding them
  const boardRows = [];
  for (let row = 0; row < 3; row++) {
    const squaresRow = [];
    for (let col = 0; col < 3; col++) {
      const index = row * 3 + col;
      squaresRow.push(
        <Square key={index} _id={`square_${index}`} value={squares[index]} onSquareClick={() => handleClick(index)} />
      );
    }
    boardRows.push(
      <div key={row} className="board-row">
        {squaresRow}
      </div>
    );
  }

  return (
    <>
      <div className="status">{status}</div>
      {boardRows}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setIsAscending] = useState(true);

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    const tempHistory = history.slice(0, nextMove + 1);
    setHistory(tempHistory);
  }

  //ascending, descending
  function toggleMoves() {
    setIsAscending(!isAscending);
  }

  function getPosition(pos) {
    const list = [11,12,13,21,22,23,31,32,33]
    return list[pos];
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    let curMove;
    if (move>0) {
      for (let i = 0; i < 9; i++ ) {
        if (history[move][i] != history[move-1][i]) {
          curMove = history[move][i] + ':'+ getPosition(i);
          break;
        }
      }
    }
    //For the current move only, show “You are at move #…” instead of a button
    return (
      <li key={move} style={{marginTop: 5}}>
        {move < currentMove || move == 0 ? <button onClick={() => jumpTo(move)}>{description} &nbsp; | &nbsp; {curMove}</button>
          : <span>You are at move #{move} &nbsp; | &nbsp; {curMove}</span>}
      </li>
    );
  });

  if (!isAscending) {
    moves.reverse()
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <button style={{marginLeft: 10, marginTop: 27, height: 100}} onClick={toggleMoves}>{isAscending ? "Ascending" : "Descending"}</button>
      <div className="game-info">
        <ol style={{listStyleType: 'none'}}>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], lines[i]];
    }
  }
  return null;
}
