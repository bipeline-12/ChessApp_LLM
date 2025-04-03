import React from 'react';

const Square = ({ row, col, piece, isSelected, isHighlighted, isLastMove, onClick }) => {
  const isLightSquare = (row + col) % 2 === 0;
  
  // Determine background color based on state
  let backgroundColor = isLightSquare ? '#f0d9b5' : '#b58863';
  if (isSelected) {
    backgroundColor = '#646fa8';
  } else if (isHighlighted) {
    backgroundColor = isLightSquare ? '#afd8af' : '#8fbc8f';
  } else if (isLastMove) {
    backgroundColor = isLightSquare ? '#f7e9b5' : '#d8b377';
  }
  
  // Get coordinates in chess notation
  const file = String.fromCharCode(97 + col);
  const rank = 8 - row;
  
  // Determine piece image URL
  const getPieceImage = (piece) => {
    if (!piece) return null;
    
    const color = piece[0] === 'w' ? 'white' : 'black';
    let pieceType;
    
    switch (piece[1]) {
      case 'K': pieceType = 'king'; break;
      case 'Q': pieceType = 'queen'; break;
      case 'R': pieceType = 'rook'; break;
      case 'B': pieceType = 'bishop'; break;
      case 'N': pieceType = 'knight'; break;
      case 'P': pieceType = 'pawn'; break;
      default: return null;
    }
    
    return `https://www.chess.com/chess-themes/pieces/neo/150/${color}_${pieceType}.png`;
  };
  
  return (
    <div 
      className="square" 
      style={{
        backgroundColor,
        position: 'relative',
        width: '50px',
        height: '50px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer'
      }}
      onClick={() => onClick(row, col)}
    >
      {/* Coordinates on edges */}
      {col === 0 && (
        <div style={{
          position: 'absolute',
          left: '2px',
          top: '2px',
          fontSize: '10px',
          color: isLightSquare ? '#b58863' : '#f0d9b5'
        }}>
          {rank}
        </div>
      )}
      {row === 7 && (
        <div style={{
          position: 'absolute',
          right: '2px',
          bottom: '2px',
          fontSize: '10px',
          color: isLightSquare ? '#b58863' : '#f0d9b5'
        }}>
          {file}
        </div>
      )}
      
      {/* Chess piece */}
      {piece && (
        <img 
          src={getPieceImage(piece)} 
          alt={piece} 
          style={{
            width: '85%',
            height: '85%',
            objectFit: 'contain'
          }}
          draggable={false}
        />
      )}
      
      {/* Highlight for legal moves on empty squares */}
      {isHighlighted && !piece && (
        <div style={{
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          backgroundColor: 'rgba(0, 0, 0, 0.2)'
        }} />
      )}
    </div>
  );
};

export default Square;
