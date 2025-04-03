// Board.jsx
import React from 'react';
import Square from './Square';

const Board = ({
  board,
  selectedSquare,
  highlightedSquares,
  lastMove,
  onSquareClick
}) => {
  const isHighlighted = (row, col) => highlightedSquares.some(([r, c]) => r === row && c === col);
  const isLastMove = (row, col) => {
    if (!lastMove) return false;
    const { from, to } = lastMove;
    return (from[0] === row && from[1] === col) || (to[0] === row && to[1] === col);
  };

  return (
    <div
      className="grid grid-cols-8 rounded-lg shadow-lg overflow-hidden"
      style={{ width: '512px' }}
    >
      {board.map((row, rowIndex) =>
        row.map((piece, colIndex) => (
          <Square
            key={`${rowIndex}-${colIndex}`}
            row={rowIndex}
            col={colIndex}
            piece={piece}
            isSelected={selectedSquare?.[0] === rowIndex && selectedSquare[1] === colIndex}
            isHighlighted={isHighlighted(rowIndex, colIndex)}
            isLastMove={isLastMove(rowIndex, colIndex)}
            onClick={onSquareClick}
          />
        ))
      )}
    </div>
  );
};

export default Board;
