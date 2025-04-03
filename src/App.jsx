// This is a complete React UI revamp based on your updated vision
// It includes a landing page and a game screen with styled components
// Uses Tailwind CSS-like styles for clarity and modern UI

import React, { useState } from 'react';
import Board from './components/Board';
import GameControls from './components/GameControls';
import GameInfo from './components/GameInfo';
import PromotionModal from './components/PromotionModal';
import ApiKeyModal from './components/ApiKeyModal';
import useChessGame, { GAME_MODES } from './hooks/useChessGame';
import { FaChessKnight } from 'react-icons/fa';


function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);

  const {
    board,
    currentPlayer,
    selectedSquare,
    highlightedSquares,
    gameState,
    lastMove,
    moveHistory,
    promotionPending,
    gameMode,
    llmProvider,
    apiKey,
    loading,
    error,
    hintSquares,
    requestHint,
    handleSquareClick,
    handlePromotion,
    changeGameMode,
    setLlmProvider,
    setApiKey,
    resetGame,
  } = useChessGame();

  const handleModeSelection = (mode) => {
    changeGameMode(mode);
    if (mode === GAME_MODES.HUMAN_VS_LLM && !apiKey) {
      setShowApiKeyModal(true);
    }
    setGameStarted(true);
  };

  const handleApiKeySave = (key) => {
    setApiKey(key);
    setShowApiKeyModal(false);
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-[#2e1c0f] flex flex-col items-center justify-center text-white">
        
        <h1 className="text-5xl font-bold mb-8"> <FaChessKnight className="text-yellow-500" />
        LLM-Chess</h1>
        <div className="flex gap-6">
          <button
            className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-lg font-semibold rounded-lg shadow-md"
            onClick={() => handleModeSelection(GAME_MODES.HUMAN_VS_HUMAN)}
          >
            Human vs Human
          </button>
          <button
            className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-lg font-semibold rounded-lg shadow-md"
            onClick={() => handleModeSelection(GAME_MODES.HUMAN_VS_LLM)}
          >
            Human vs LLM
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f2e4c5] text-gray-800">
      <header className="bg-[#2e1c0f] text-white py-4 px-6 text-center shadow-md">
        <h1 className="text-3xl font-bold">LLM-Chess</h1>
      </header>

      <main className="flex flex-col items-center py-6 px-4">
        <GameControls
          gameMode={gameMode}
          llmProvider={llmProvider}
          apiKey={apiKey}
          onGameModeChange={changeGameMode}
          onLlmProviderChange={setLlmProvider}
          onApiKeyChange={setApiKey}
          onReset={resetGame}
        />

        <div className="flex flex-col md:flex-row gap-6 mt-6">
          <Board
            board={board}
            selectedSquare={selectedSquare}
            highlightedSquares={highlightedSquares}
            lastMove={lastMove}
            onSquareClick={handleSquareClick}
            hintSquares={hintSquares}
          />

          <GameInfo
            currentPlayer={currentPlayer}
            gameState={gameState}
            moveHistory={moveHistory}
            loading={loading}
            error={error}
            requestHint={requestHint}
          />
        </div>
      </main>

      {promotionPending && (
        <PromotionModal
          color={currentPlayer === 'white' ? 'white' : 'black'}
          onSelect={handlePromotion}
        />
      )}

      <ApiKeyModal
        isOpen={showApiKeyModal}
        provider={llmProvider}
        onSave={handleApiKeySave}
        onCancel={() => setShowApiKeyModal(false)}
      />

      <footer className="text-center text-sm text-gray-600 py-4">
        Created for BharatX Tech Intern Task — LLM Chess
      </footer>
    </div>
  );
}

export default App;
