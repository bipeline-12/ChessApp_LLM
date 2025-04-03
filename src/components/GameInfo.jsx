import React from 'react';

const GameInfo = ({ currentPlayer, gameState, moveHistory, loading, error }) => {
  const getStatusMessage = () => {
    if (loading) return 'AI is thinking...';
    if (error) return `Error: ${error}`;
    
    switch (gameState) {
      case 'check':
        return `${currentPlayer === 'white' ? 'White' : 'Black'} is in check!`;
      case 'checkmate':
        return `Checkmate! ${currentPlayer === 'white' ? 'Black' : 'White'} wins!`;
      case 'stalemate':
        return 'Stalemate! The game is a draw.';
      default:
        return `Current player: ${currentPlayer === 'white' ? 'White' : 'Black'}`;
    }
  };
  
  // Format the move history to display in a more readable way
  const formatMoveHistory = () => {
    const formattedHistory = [];
    
    for (let i = 0; i < moveHistory.length; i += 2) {
      const moveNumber = Math.floor(i / 2) + 1;
      const whiteMove = moveHistory[i];
      const blackMove = i + 1 < moveHistory.length ? moveHistory[i + 1] : '';
      
      formattedHistory.push(
        <div key={moveNumber} style={{ display: 'flex' }}>
          <div style={{ width: '30px', color: '#888' }}>{moveNumber}.</div>
          <div style={{ width: '70px' }}>{whiteMove}</div>
          <div style={{ width: '70px' }}>{blackMove}</div>
        </div>
      );
    }
    
    return formattedHistory;
  };
  
  return (
    <div
      className="game-info"
      style={{
        width: '200px',
        padding: '16px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}
    >
      <div>
        <h3 style={{ margin: 0, marginBottom: '8px' }}>Game Status</h3>
        <div 
          style={{ 
            padding: '8px',
            backgroundColor: loading ? '#f8f9fa' : error ? '#ffebee' : '#e8f5e9',
            borderRadius: '4px',
            border: loading ? '1px solid #dee2e6' : error ? '1px solid #ffcdd2' : '1px solid #c8e6c9'
          }}
        >
          {getStatusMessage()}
          {loading && (
            <div 
              style={{ 
                marginTop: '8px',
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <div className="loading-spinner"></div>
            </div>
          )}
        </div>
      </div>
      
      <div>
        <h3 style={{ margin: 0, marginBottom: '8px' }}>Move History</h3>
        <div
          style={{
            height: '300px',
            overflowY: 'auto',
            padding: '8px',
            backgroundColor: '#fff',
            borderRadius: '4px',
            border: '1px solid #ddd',
            fontSize: '14px'
          }}
        >
          {moveHistory.length > 0 ? formatMoveHistory() : <p>No moves yet.</p>}
        </div>
      </div>
    </div>
  );
};
export default GameInfo;