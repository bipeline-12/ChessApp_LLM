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

  const formatMoveHistory = () => {
    const formatted = [];
    for (let i = 0; i < moveHistory.length; i += 2) {
      const moveNum = Math.floor(i / 2) + 1;
      const white = moveHistory[i];
      const black = i + 1 < moveHistory.length ? moveHistory[i + 1] : '';
      formatted.push(
        <div key={moveNum} className="flex gap-4">
          <div className="text-gray-500 w-6">{moveNum}.</div>
          <div className="w-12">{white}</div>
          <div className="w-12">{black}</div>
        </div>
      );
    }
    return formatted;
  };

  return (
    <div
      className="bg-[#fdfaf6] p-6 rounded-xl shadow-md w-full max-w-xs border border-[#e8decf] space-y-6"
    >
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">Game Status</h3>
        <div
          className={`p-3 rounded-md border font-semibold text-sm ${
            loading
              ? 'bg-gray-100 border-gray-300 text-gray-600'
              : error
              ? 'bg-red-100 border-red-300 text-red-700'
              : 'bg-green-50 border-green-300 text-green-700'
          }`}
        >
          {getStatusMessage()}
          {loading && (
            <div className="mt-2 flex justify-center">
              <div className="w-4 h-4 border-2 border-t-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">Move History</h3>
        <div
          className="h-64 overflow-y-auto bg-white rounded-md border border-gray-300 px-4 py-2 text-sm font-mono shadow-inner"
        >
          {moveHistory.length > 0 ? formatMoveHistory() : <p>No moves yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default GameInfo;
