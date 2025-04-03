import React, { useState } from 'react';
import { GAME_MODES } from '../hooks/useChessGame';
import { getAvailableLLMs } from '../services/llmService';
import { FaChessBoard, FaRobot, FaKey, FaEye, FaEyeSlash, FaUndo, FaPalette } from 'react-icons/fa';



const GameControls = ({
  gameMode,
  llmProvider,
  apiKey,
  onGameModeChange,
  onLlmProviderChange,
  onApiKeyChange,
  onReset,
  requestHint
}) => {
  const [showApiKey, setShowApiKey] = useState(false);
  const availableLLMs = getAvailableLLMs();

  return (
    <div
      className="bg-[#fdfaf6] p-6 rounded-xl shadow-md w-full max-w-md space-y-4 border border-[#e8decf]"
    >
      <h3 className="text-lg font-bold text-gray-800"> <FaChessBoard className="text-yellow-600" />Game Settings</h3>

      <div className="space-y-2">
        <label className="block font-semibold text-gray-700">Game Mode:</label>
        <div className="flex gap-6">
          <label className="flex items-center space-x-2 font-medium text-gray-700">
            <input
              type="radio"
              className="accent-yellow-500"
              name="gameMode"
              value={GAME_MODES.HUMAN_VS_HUMAN}
              checked={gameMode === GAME_MODES.HUMAN_VS_HUMAN}
              onChange={() => onGameModeChange(GAME_MODES.HUMAN_VS_HUMAN)}
            />
            <span>Human vs Human</span>
          </label>
          <label className="flex items-center space-x-2 font-medium text-gray-700">
            <input
              type="radio"
              className="accent-yellow-500"
              name="gameMode"
              value={GAME_MODES.HUMAN_VS_LLM}
              checked={gameMode === GAME_MODES.HUMAN_VS_LLM}
              onChange={() => onGameModeChange(GAME_MODES.HUMAN_VS_LLM)}
            />
            <span>Human vs AI (LLM)</span>
          </label>
        </div>
      </div>

      {gameMode === GAME_MODES.HUMAN_VS_LLM && (
        <>
          <div>
            <label className="block font-semibold text-gray-700 mb-1">LLM Provider:</label>
            <select
              value={llmProvider}
              onChange={(e) => onLlmProviderChange(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              {availableLLMs.map(llm => (
                <option key={llm.id} value={llm.id}>{llm.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">API Key:</label>
            <div className="flex items-center">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => onApiKeyChange(e.target.value)}
                placeholder={`Enter ${llmProvider} API Key`}
                className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="ml-2 px-3 py-2 border rounded-md text-sm bg-white hover:bg-gray-100 transition"
              >
                {showApiKey ? 'Hide' : 'Show'}
              </button>
            </div>
            <small className="text-xs text-gray-500 mt-1 block">
              Your API key is used only for making requests and is not stored.
            </small>
          </div>
        </>
      )}

      <button
        onClick={onReset}
        className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg shadow-md transition-all font-semibold"
      >
        New Game </button>
        <button
          onClick={requestHint}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md transition-all font-semibold"
        >
            💡 Get Hint
        </button>
    </div>
  );
};

export default GameControls;
