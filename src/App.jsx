import React, { useState } from 'react';
import Board from './components/Board';
import GameControls from './components/GameControls';
import GameInfo from './components/GameInfo';
import PromotionModal from './components/PromotionModal';
import ApiKeyModal from './components/ApiKeyModal';
import useChessGame, { GAME_MODES } from './hooks/useChessGame';


function App() {
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
    handleSquareClick,
    handlePromotion,
    setGameMode,
    setLlmProvider,
    setApiKey,
    resetGame
  } = useChessGame();

  const [showApiKeyModal, setShowApiKeyModal] = useState(false);

  const handleGameModeChange = (mode) => {
    if (mode === GAME_MODES.HUMAN_VS_LLM && !apiKey) {
      setShowApiKeyModal(true);
    }
    setGameMode(mode);
  };

  const handleLlmProviderChange = (provider) => {
    setLlmProvider(provider);
    setShowApiKeyModal(true);
  };

  const handleApiKeySave = (key) => {
    setApiKey(key);
    setShowApiKeyModal(false);
  };

  return (
    <div className="app-container">
      <header>
        <h1>Chess AI with Language Models</h1>
      </header>

      <main>
        <GameControls
          gameMode={gameMode}
          llmProvider={llmProvider}
          apiKey={apiKey}
          onGameModeChange={handleGameModeChange}
          onLlmProviderChange={handleLlmProviderChange}
          onApiKeyChange={setApiKey}
          onReset={resetGame}
        />

        <div className="game-container">
          <Board
            board={board}
            selectedSquare={selectedSquare}
            highlightedSquares={highlightedSquares}
            lastMove={lastMove}
            onSquareClick={handleSquareClick}
          />

          <GameInfo
            currentPlayer={currentPlayer}
            gameState={gameState}
            moveHistory={moveHistory}
            loading={loading}
            error={error}
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

      <footer>
        <p>Created for BharatX Tech Intern Task - Chess with LLM</p>
      </footer>
    </div>
  );
}

export default App;