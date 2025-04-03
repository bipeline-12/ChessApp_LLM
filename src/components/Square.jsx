// Square.jsx
import React from 'react';

const Square = ({ row, col, piece, isSelected, isHighlighted, isLastMove, isHinted, onClick }) => {
  const isLight = (row + col) % 2 === 0;

  let bgColor = isLight ? '#f0d9b5' : '#b58863';
  if (isSelected) bgColor = '#646fa8';
  else if (isHighlighted) bgColor = isLight ? '#afd8af' : '#8fbc8f';
  else if (isLastMove) bgColor = isLight ? '#f7e9b5' : '#d8b377';

  const getPieceImage = (piece) => piece ? `/pieces/${piece}.svg` : null;

  return (
    <div
      className="relative w-full aspect-square flex justify-center items-center cursor-pointer transition-transform hover:scale-105"
      style={{ backgroundColor: bgColor }}
      onClick={() => onClick(row, col)}
    >

      {col === 0 && (
        <div className="absolute top-1 left-1 text-[10px] opacity-70 text-white">{8 - row}</div>
      )}
      {row === 7 && (
        <div className="absolute bottom-1 right-1 text-[10px] opacity-70 text-white">
          {String.fromCharCode(97 + col)}
        </div>
      )}
      {piece && (
        <img
          src={getPieceImage(piece)}
          alt={piece}
          className="w-[80%] h-[80%] object-contain pointer-events-none"
          draggable={false}
        />
      )}
      {isHighlighted && !piece && (
        <div className="w-4 h-4 rounded-full bg-black/20" />
      )}
      {isHinted && (
        <div className="absolute inset-1 border-4 border-yellow-400 rounded-md pointer-events-none" />
      )}
    </div>
  );
};

export default Square;
