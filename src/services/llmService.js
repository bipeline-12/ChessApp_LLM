
import { boardToFEN, convertFromAlgebraicNotation } from './chessLogic';

// Define the available LLM providers and their endpoints
const LLM_PROVIDERS = {
  OPENAI: {
    name: 'OpenAI GPT',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    headers: (apiKey) => ({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    }),
    payload: (prompt, board, currentPlayer, moveHistory) => ({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a chess AI assistant. Analyze the board and suggest the best move.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 200
    }),
    extractMove: (response) => {
      try {
        const content = response.choices[0].message.content;
        const movePattern = /([a-h][1-8][a-h][1-8])/;
        const match = content.match(movePattern);
        return match ? match[1] : null;
      } catch (error) {
        console.error('Error extracting move from OpenAI response:', error);
        return null;
      }
    }
  },
  GEMINI: {
    name: 'Google Gemini',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    headers: (apiKey) => ({
      'Content-Type': 'application/json'
    }),
    payload: (prompt, board, currentPlayer, moveHistory) => ({
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 200
      }
    }),
    getUrl: (apiKey) => `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    extractMove: (response) => {
      try {
        const content = response.candidates[0].content.parts[0].text;
        const movePattern = /([a-h][1-8][a-h][1-8])/;
        const match = content.match(movePattern);
        return match ? match[1] : null;
      } catch (error) {
        console.error('Error extracting move from Gemini response:', error);
        return null;
      }
    }
  },
  COHERE: {
    name: 'Cohere',
    endpoint: 'https://api.cohere.ai/v1/generate',
    headers: (apiKey) => ({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    }),
    payload: (prompt, board, currentPlayer, moveHistory) => ({
      model: 'command',
      prompt: prompt,
      max_tokens: 200,
      temperature: 0.7
    }),
    extractMove: (response) => {
      try {
        const content = response.generations[0].text;
        const movePattern = /([a-h][1-8][a-h][1-8])/;
        const match = content.match(movePattern);
        return match ? match[1] : null;
      } catch (error) {
        console.error('Error extracting move from Cohere response:', error);
        return null;
      }
    }
  }
};

export const getAvailableLLMs = () => {
  return Object.keys(LLM_PROVIDERS).map(key => ({
    id: key,
    name: LLM_PROVIDERS[key].name
  }));
};

export const generateChessMove = async (board, currentPlayer, moveHistory, castlingRights, enPassantTarget, halfMoveClock, fullMoveNumber, llmProvider, apiKey) => {
  if (!LLM_PROVIDERS[llmProvider]) {
    throw new Error(`Unsupported LLM provider: ${llmProvider}`);
  }

  const provider = LLM_PROVIDERS[llmProvider];
  
  // Generate FEN string for the current board state
  const fen = boardToFEN(
    board, 
    currentPlayer, 
    castlingRights, 
    enPassantTarget, 
    halfMoveClock, 
    fullMoveNumber
  );
  
  // Create a prompt for the LLM
  const prompt = `
You are playing as the ${currentPlayer === 'white' ? 'white' : 'black'} pieces in a chess game.
Current board state in FEN notation: ${fen}

Previous moves: ${moveHistory.length > 0 ? moveHistory.join(', ') : 'No moves played yet.'}

Please analyze the position and choose the best move. Follow these rules:
1. Your response must include exactly one valid chess move in simple algebraic notation (e.g., e2e4).
2. The move must be legal according to standard chess rules.
3. Format your move answer as a2a4 (from square to square, no spaces, lowercase).
4. Do not include any other text or explanation.

Your move (in a2a4 format):`;

  try {
    let response;
    
    if (provider.getUrl) {
      // For APIs that need the key in the URL (like Gemini)
      response = await fetch(provider.getUrl(apiKey), {
        method: 'POST',
        headers: provider.headers(apiKey),
        body: JSON.stringify(provider.payload(prompt, board, currentPlayer, moveHistory))
      });
    } else {
      // For standard APIs with key in header
      response = await fetch(provider.endpoint, {
        method: 'POST',
        headers: provider.headers(apiKey),
        body: JSON.stringify(provider.payload(prompt, board, currentPlayer, moveHistory))
      });
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`LLM API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const moveNotation = provider.extractMove(data);
    
    if (!moveNotation) {
      throw new Error('Failed to extract a valid move from the LLM response');
    }
    
    return convertFromAlgebraicNotation(moveNotation);
  } catch (error) {
    console.error('Error generating chess move:', error);
    throw error;
  }
};

export async function getHintMove({ fen, moveHistory, provider, apiKey }) {
    const prompt = `You're a chess expert. Given the current position and history, suggest a strong next move in UCI format (e.g., e2e4). Respond with only the move.
  
  FEN: ${fen}
  Moves: ${moveHistory.join(' ')}
  
  Best move:`;
  
    const result = await generateChessMove({ prompt, provider, apiKey });
    return result; // should be like "e2e4"
  }
  