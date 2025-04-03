import React from 'react';

const Piece = ({ type, color }) => {
  const getPieceImage = () => {
    const pieceColor = color === 'white' ? 'white' : 'black';
    let pieceType;
    
    switch (type) {
      case 'K': pieceType = 'king'; break;
      case 'Q': pieceType = 'queen'; break;
      case 'R': pieceType = 'rook'; break;
      case 'B': pieceType = 'bishop'; break;
      case 'N': pieceType = 'knight'; break;
      case 'P': pieceType = 'pawn'; break;
      default: return null;
    }
    
    return `https://www.chess.com/chess-themes/pieces/neo/150/${pieceColor}_${pieceType}.png`;
  };
  
  return (
    <img 
      src={getPieceImage()} 
      alt={`${color} ${type}`} 
      style={{
        width: '40px',
        height: '40px',
        objectFit: 'contain',
        cursor: 'pointer'
      }}
    />
  );
};
export default Piece;