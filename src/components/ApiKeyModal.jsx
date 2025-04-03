import React, { useState } from 'react';

const ApiKeyModal = ({ isOpen, provider, onSave, onCancel }) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  
  if (!isOpen) return null;
  
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
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
          padding: '24px',
          borderRadius: '8px',
          width: '400px',
          maxWidth: '90%'
        }}
      >
        <h2 style={{ margin: 0, marginBottom: '16px' }}>Enter {provider} API Key</h2>
        
        <p>
          To use {provider} as your chess AI, please enter your API key.
          Your key is never stored and is only used for direct API requests.
        </p>
        
        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="api-key-input" style={{ display: 'block', marginBottom: '8px' }}>
            API Key:
          </label>
          <div style={{ display: 'flex' }}>
            <input
              id="api-key-input"
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}
            />
            <button
              onClick={() => setShowKey(!showKey)}
              style={{
                marginLeft: '8px',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                backgroundColor: '#fff',
                cursor: 'pointer'
              }}
            >
              {showKey ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '8px 16px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              backgroundColor: '#fff',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(apiKey)}
            disabled={!apiKey.trim()}
            style={{
              padding: '8px 16px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: apiKey.trim() ? '#4CAF50' : '#e0e0e0',
              color: apiKey.trim() ? 'white' : '#999',
              cursor: apiKey.trim() ? 'pointer' : 'not-allowed'
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;