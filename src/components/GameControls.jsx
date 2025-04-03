import React, { useState } from 'react';
import { GAME_MODES } from '../hooks/useChessGame';
import { getAvailableLLMs } from '../services/llmService';

const GameControls = ({ 
  gameMode, 
  llmProvider, 
  apiKey, 
  onGameModeChange, 
  onLlmProviderChange, 
  onApiKeyChange,
  onReset 
}) => {
  const [showApiKey, setShowApiKey] = useState(false);
  const availableLLMs = getAvailableLLMs();
  
  return (
    <div 
      className="game-controls"
      style={{
        backgroundColor: '#f5f5f5',
        padding: '16px',
        borderRadius: '8px',
        marginBottom: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}
    >
      <div>
        <h3 style={{ marginTop: 0 }}>Game Settings</h3>
      </div>
      
      <div>
        <label>Game Mode:</label>
        <div style={{ marginTop: '8px' }}>
          <label style={{ marginRight: '12px' }}>
            <input
              type="radio"
              name="gameMode"
              value={GAME_MODES.HUMAN_VS_HUMAN}
              checked={gameMode === GAME_MODES.HUMAN_VS_HUMAN}
              onChange={() => onGameModeChange(GAME_MODES.HUMAN_VS_HUMAN)}
            />
            Human vs Human
          </label>
          <label>
            <input
              type="radio"
              name="gameMode"
              value={GAME_MODES.HUMAN_VS_LLM}
              checked={gameMode === GAME_MODES.HUMAN_VS_LLM}
              onChange={() => onGameModeChange(GAME_MODES.HUMAN_VS_LLM)}
            />
            Human vs AI (LLM)
          </label>
        </div>
      </div>
      
      {gameMode === GAME_MODES.HUMAN_VS_LLM && (
        <>
          <div>
            <label htmlFor="llm-provider">LLM Provider:</label>
            <select
              id="llm-provider"
              value={llmProvider}
              onChange={(e) => onLlmProviderChange(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                marginTop: '4px'
              }}
            >
              {availableLLMs.map(llm => (
                <option key={llm.id} value={llm.id}>{llm.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="api-key">API Key:</label>
            <div style={{ display: 'flex', marginTop: '4px' }}>
              <input
                id="api-key"
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => onApiKeyChange(e.target.value)}
                placeholder={`Enter ${llmProvider} API Key`}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}
              />
              <button
                onClick={() => setShowApiKey(!showApiKey)}
                style={{
                  marginLeft: '8px',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  backgroundColor: '#fff',
                  cursor: 'pointer'
                }}
              >
                {showApiKey ? 'Hide' : 'Show'}
              </button>
            </div>
            <small style={{ color: '#777', marginTop: '4px', display: 'block' }}>
              Your API key is used only for making requests and is not stored.
            </small>
          </div>
        </>
      )}
      
      <div>
        <button
          onClick={onReset}
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '10px 16px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          New Game
        </button>
      </div>
    </div>
  );
};
export default GameControls;