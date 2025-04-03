import React from 'react';

const PromotionModal = ({ color, onSelect }) => {
  const pieces = ['Q', 'R', 'B', 'N']; // Queen, Rook, Bishop, Knight
  
  return (
    <div 
      className="promotion-modal" 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100
      }}
    >
      <div 
        style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <h3>Choose a piece for promotion</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          {pieces.map(piece => (
            <div 
              key={piece}
              onClick={() => onSelect(piece)}
              style={{
                cursor: 'pointer',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                transition: 'transform 0.2s',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
              onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.1)' }}
              onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)' }}
            >
              <img 
                src={`https://www.chess.com/chess-themes/pieces/neo/150/${color}_${piece.toLowerCase() === 'n' ? 'knight' : piece === 'Q' ? 'queen' : piece === 'R' ? 'rook' : 'bishop'}.png`}
                alt={piece}
                style={{ width: '40px', height: '40px' }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromotionModal;