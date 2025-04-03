import React from 'react';
import Square from './Square';

const Board = ({ 
  board, 
  selectedSquare, 
  highlightedSquares, 
  lastMove,
  onSquareClick 
}) => {
  const isHighlighted = (row, col) => {
    return highlightedSquares.some(([r, c]) => r === row && c === col);
  };
  
  const isLastMove = (row, col) => {
    if (!lastMove) return false;
    
    const { from, to } = lastMove;
    return (from[0] === row && from[1] === col) || (to[0] === row && to[1] === col);
  };
  
  return (
    <div 
      className="chess-board" 
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(8, 50px)',
        gridTemplateRows: 'repeat(8, 50px)',
        border: '2px solid #8b4513',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)'
      }}
    >
      {board.map((row, rowIndex) => (
        row.map((piece, colIndex) => (
          <Square
            key={`${rowIndex}-${colIndex}`}
            row={rowIndex}
            col={colIndex}
            piece={piece}
            isSelected={selectedSquare && selectedSquare[0] === rowIndex && selectedSquare[1] === colIndex}
            isHighlighted={isHighlighted(rowIndex, colIndex)}
            isLastMove={isLastMove(rowIndex, colIndex)}
            onClick={onSquareClick}
          />
        ))
      ))}
    </div>
  );
};

export default Board;
