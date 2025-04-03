// src/hooks/useChessGame.js
import { useState, useEffect, useCallback } from 'react';
import { 
  initialBoardState, 
  pieceColor, 
  isValidMove, 
  movePiece, 
  getAllLegalMoves, 
  getGameState, 
  moveToAlgebraic,
  convertToAlgebraicNotation
} from '../services/chessLogic';
import { generateChessMove } from '../services/llmService';

export const GAME_MODES = {
  HUMAN_VS_HUMAN: 'human_vs_human',
  HUMAN_VS_LLM: 'human_vs_llm'
};

const useChessGame = () => {
  const [hintSquares, setHintSquares] = useState([]);

  const [board, setBoard] = useState(initialBoardState);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [highlightedSquares, setHighlightedSquares] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState('white'); // 'white' or 'black'
  const [gameMode, setGameMode] = useState(GAME_MODES.HUMAN_VS_HUMAN);
  const [llmProvider, setLlmProvider] = useState('GEMINI');
  const [apiKey, setApiKey] = useState('');
  const [gameState, setGameState] = useState('ongoing'); // 'ongoing', 'check', 'checkmate', 'stalemate'
  const [moveHistory, setMoveHistory] = useState([]);
  const [castlingRights, setCastlingRights] = useState({
    whiteKingside: true,
    whiteQueenside: true,
    blackKingside: true,
    blackQueenside: true
  });
  const [enPassantTarget, setEnPassantTarget] = useState(null);
  const [halfMoveClock, setHalfMoveClock] = useState(0);
  const [fullMoveNumber, setFullMoveNumber] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [promotionPending, setPromotionPending] = useState(null);
  const [lastMove, setLastMove] = useState(null);

  // Calculate legal moves for the current player
  const legalMoves = getAllLegalMoves(board, currentPlayer, castlingRights, enPassantTarget);

  // Update game state when the board changes
  useEffect(() => {
    const newGameState = getGameState(board, currentPlayer, legalMoves);
    setGameState(newGameState);
  }, [board, currentPlayer, legalMoves]);

  // Handle LLM move if it's computer's turn
  useEffect(() => {
    const makeLLMMove = async () => {
      if (gameMode === GAME_MODES.HUMAN_VS_LLM && 
          currentPlayer === 'black' && 
          gameState === 'ongoing' && 
          apiKey) {
        setLoading(true);
        setError(null);
        
        try {
          const algebraicMoveHistory = moveHistory.map(move => 
            move.includes('O-O') ? move : move.replace(/[^a-h1-8]/g, '')
          );
          
          const llmMove = await generateChessMove(
            board, 
            currentPlayer, 
            algebraicMoveHistory, 
            castlingRights, 
            enPassantTarget, 
            halfMoveClock, 
            fullMoveNumber, 
            llmProvider, 
            apiKey
          );
          
          if (llmMove) {
            handleMove(llmMove.from, llmMove.to);
          } else {
            setError('The AI failed to generate a valid move. Please try again.');
          }
        } catch (err) {
          setError(`LLM error: ${err.message}`);
        } finally {
          setLoading(false);
        }
      }
    };
    
    // Add a small delay to make it feel more natural
    const timerId = setTimeout(() => {
      makeLLMMove();
    }, 1000);
    
    return () => clearTimeout(timerId);
  }, [currentPlayer, gameMode, board, gameState, apiKey, llmProvider]);

  // Handle square selection
  const handleSquareClick = useCallback((row, col) => {
    // Ignore clicks during loading or game over
    setHintSquares([]);
    if (loading || gameState === 'checkmate' || gameState === 'stalemate') {
      return;
    }
    
    // Handle promotion selection
    if (promotionPending) {
      return;
    }

    
      
    
    const clickedPiece = board[row][col];
    const clickedPieceColor = pieceColor(clickedPiece);
    
    // If a square is already selected
    if (selectedSquare) {
      const [selectedRow, selectedCol] = selectedSquare;
      const selectedPiece = board[selectedRow][selectedCol];
      
      // If clicking on a different square of the same color, select the new piece
      if (clickedPieceColor === currentPlayer && (row !== selectedRow || col !== selectedCol)) {
        setSelectedSquare([row, col]);
        
        // Highlight possible moves for the new piece
        const possibleMoves = legalMoves.filter(move => 
          move.from[0] === row && move.from[1] === col
        );
        setHighlightedSquares(possibleMoves.map(move => move.to));
        return;
      }
      
      // Try to make a move
      const move = legalMoves.find(move => 
        move.from[0] === selectedRow && 
        move.from[1] === selectedCol && 
        move.to[0] === row && 
        move.to[1] === col
      );
      
      if (move) {
        handleMove([selectedRow, selectedCol], [row, col]);
      }
      
      // Clear selection
      setSelectedSquare(null);
      setHighlightedSquares([]);

      if (
        gameMode === GAME_MODES.HUMAN_VS_LLM &&
        currentPlayer === 'black' &&
        !gameOver
      ) {
        requestLlmMove();
      }
    } else {
      // Select the square if it has a piece of the current player
      if (clickedPieceColor === currentPlayer) {
        setSelectedSquare([row, col]);
        
        // Highlight possible moves
        const possibleMoves = legalMoves.filter(move => 
          move.from[0] === row && move.from[1] === col
        );
        setHighlightedSquares(possibleMoves.map(move => move.to));
      }
    }
  }, [board, selectedSquare, currentPlayer, legalMoves, loading, gameState, promotionPending]);

  // Handle the actual move execution
  const handleMove = useCallback((from, to) => {
    const [fromRow, fromCol] = from;
    const [toRow, toCol] = to;
    
    const piece = board[fromRow][fromCol];
    const pieceType = piece ? piece.substring(1) : null;
    
    // Check if this is a pawn about to be promoted
    const isPromotion = pieceType === 'P' && (toRow === 0 || toRow === 7);
    
    if (isPromotion) {
      setPromotionPending({ from, to });
      return;
    }
    
    // Execute the move
    const { newBoard, newCastlingRights, newEnPassantTarget } = movePiece(
      board, 
      from, 
      to, 
      castlingRights, 
      enPassantTarget
    );
    
    // Update move history
    const algebraicMove = moveToAlgebraic(board, from, to);
    setMoveHistory(prev => [...prev, algebraicMove]);
    
    // Update last move for highlighting
    setLastMove({ from, to });
    
    // Update game state
    setBoard(newBoard);
    setCastlingRights(newCastlingRights);
    setEnPassantTarget(newEnPassantTarget);
    
    // Update half move clock and full move number
    const isCapture = board[toRow][toCol] !== null || (pieceType === 'P' && fromCol !== toCol);
    const newHalfMoveClock = pieceType === 'P' || isCapture ? 0 : halfMoveClock + 1;
    setHalfMoveClock(newHalfMoveClock);
    
    if (currentPlayer === 'black') {
      setFullMoveNumber(fullMoveNumber + 1);
    }
    
    // Switch player
    setCurrentPlayer(prev => prev === 'white' ? 'black' : 'white');
    
    // Clear selection
    setSelectedSquare(null);
    setHighlightedSquares([]);
  }, [board, castlingRights, enPassantTarget, halfMoveClock, fullMoveNumber, currentPlayer]);

  // Handle pawn promotion
  const handlePromotion = useCallback((promotionPiece) => {
    if (!promotionPending) return;
    
    const { from, to } = promotionPending;
    const [fromRow, fromCol] = from;
    const [toRow, toCol] = to;
    
    // Create a new board with the promotion
    const newBoard = board.map(row => [...row]);
    const pieceColor = board[fromRow][fromCol][0];
    newBoard[toRow][toCol] = `${pieceColor}${promotionPiece}`;
    newBoard[fromRow][fromCol] = null;
    
    // Update move history with promotion notation
    const algebraicMove = moveToAlgebraic(board, from, to, promotionPiece);
    setMoveHistory(prev => [...prev, algebraicMove]);
    
    // Update last move for highlighting
    setLastMove({ from, to });
    
    // Update game state
    setBoard(newBoard);
    setEnPassantTarget(null);
    setHalfMoveClock(0); // Reset half move clock for pawn moves
    
    if (currentPlayer === 'black') {
      setFullMoveNumber(fullMoveNumber + 1);
    }
    
    // Switch player
    setCurrentPlayer(prev => prev === 'white' ? 'black' : 'white');
    
    // Clear promotion pending state
    setPromotionPending(null);
  }, [board, promotionPending, currentPlayer, fullMoveNumber]);

  // Reset the game
  const resetGame = useCallback(() => {
    setBoard(initialBoardState);
    setSelectedSquare(null);
    setHighlightedSquares([]);
    setCurrentPlayer('white');
    setGameState('ongoing');
    setMoveHistory([]);
    setCastlingRights({
      whiteKingside: true,
      whiteQueenside: true,
      blackKingside: true,
      blackQueenside: true
    });
    setEnPassantTarget(null);
    setHalfMoveClock(0);
    setFullMoveNumber(1);
    setPromotionPending(null);
    setLastMove(null);
    setError(null);
  }, []);

  // Change game mode
  const changeGameMode = useCallback((mode) => {
    setGameMode(mode);
    resetGame();
  }, [resetGame]);

  return {
    board,
    selectedSquare,
    currentPlayer,
    gameMode,
    llmProvider,
    apiKey,
    gameState,
    moveHistory,
    loading,
    error,
    highlightedSquares,
    promotionPending,
    lastMove,
    hintSquares,
    requestHint,
    handleSquareClick,
    handlePromotion,
    resetGame,
    changeGameMode,
    setLlmProvider,
    setApiKey,
  };
};

const requestHint = async () => {
    if (!apiKey || gameMode !== GAME_MODES.HUMAN_VS_LLM) return;
    const fen = getFEN(board);
    const move = await getHintMove({ fen, moveHistory, provider: llmProvider, apiKey });
  
    if (move?.length === 4) {
      const from = [8 - Number(move[1]), move.charCodeAt(0) - 97];
      const to = [8 - Number(move[3]), move.charCodeAt(2) - 97];
      setHintSquares([from, to]);
    }
  };
  

export default useChessGame;