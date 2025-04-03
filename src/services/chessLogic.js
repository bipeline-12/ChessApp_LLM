// src/services/chessLogic.js
export const PIECES = {
    WHITE_KING: 'wK',
    WHITE_QUEEN: 'wQ',
    WHITE_ROOK: 'wR',
    WHITE_BISHOP: 'wB',
    WHITE_KNIGHT: 'wN',
    WHITE_PAWN: 'wP',
    BLACK_KING: 'bK',
    BLACK_QUEEN: 'bQ',
    BLACK_ROOK: 'bR',
    BLACK_BISHOP: 'bB',
    BLACK_KNIGHT: 'bN',
    BLACK_PAWN: 'bP',
  };
  
  export const initialBoardState = [
    [PIECES.BLACK_ROOK, PIECES.BLACK_KNIGHT, PIECES.BLACK_BISHOP, PIECES.BLACK_QUEEN, PIECES.BLACK_KING, PIECES.BLACK_BISHOP, PIECES.BLACK_KNIGHT, PIECES.BLACK_ROOK],
    [PIECES.BLACK_PAWN, PIECES.BLACK_PAWN, PIECES.BLACK_PAWN, PIECES.BLACK_PAWN, PIECES.BLACK_PAWN, PIECES.BLACK_PAWN, PIECES.BLACK_PAWN, PIECES.BLACK_PAWN],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [PIECES.WHITE_PAWN, PIECES.WHITE_PAWN, PIECES.WHITE_PAWN, PIECES.WHITE_PAWN, PIECES.WHITE_PAWN, PIECES.WHITE_PAWN, PIECES.WHITE_PAWN, PIECES.WHITE_PAWN],
    [PIECES.WHITE_ROOK, PIECES.WHITE_KNIGHT, PIECES.WHITE_BISHOP, PIECES.WHITE_QUEEN, PIECES.WHITE_KING, PIECES.WHITE_BISHOP, PIECES.WHITE_KNIGHT, PIECES.WHITE_ROOK],
  ];
  
  export const pieceColor = (piece) => {
    if (!piece) return null;
    return piece[0] === 'w' ? 'white' : 'black';
  };
  
  export const isValidMove = (board, from, to, castlingRights, enPassantTarget) => {
    const [fromRow, fromCol] = from;
    const [toRow, toCol] = to;
    
    const piece = board[fromRow][fromCol];
    if (!piece) return false;
    
    const pieceType = piece.substring(1);
    const color = pieceColor(piece);
    const targetPiece = board[toRow][toCol];
    
    // Can't capture own piece
    if (targetPiece && pieceColor(targetPiece) === color) {
      return false;
    }
    
    // Handle different piece movement rules
    switch (pieceType) {
      case 'P': // Pawn
        return isValidPawnMove(board, from, to, enPassantTarget);
      case 'R': // Rook
        return isValidRookMove(board, from, to);
      case 'N': // Knight
        return isValidKnightMove(from, to);
      case 'B': // Bishop
        return isValidBishopMove(board, from, to);
      case 'Q': // Queen
        return isValidQueenMove(board, from, to);
      case 'K': // King
        return isValidKingMove(board, from, to, castlingRights);
      default:
        return false;
    }
  };
  
  export const isValidPawnMove = (board, from, to, enPassantTarget) => {
    const [fromRow, fromCol] = from;
    const [toRow, toCol] = to;
    
    const piece = board[fromRow][fromCol];
    const color = pieceColor(piece);
    const direction = color === 'white' ? -1 : 1;
    const startRow = color === 'white' ? 6 : 1;
    
    // Check for standard pawn move (1 square forward)
    if (fromCol === toCol && toRow === fromRow + direction && !board[toRow][toCol]) {
      return true;
    }
    
    // Check for pawn's initial double move
    if (fromCol === toCol && fromRow === startRow && toRow === fromRow + 2 * direction &&
        !board[fromRow + direction][fromCol] && !board[toRow][toCol]) {
      return true;
    }
    
    // Check for diagonal capture
    if (Math.abs(fromCol - toCol) === 1 && toRow === fromRow + direction) {
      // Normal capture
      if (board[toRow][toCol] && pieceColor(board[toRow][toCol]) !== color) {
        return true;
      }
      
      // En passant capture
      if (enPassantTarget && toRow === enPassantTarget[0] && toCol === enPassantTarget[1]) {
        return true;
      }
    }
    
    return false;
  };
  
  export const isValidRookMove = (board, from, to) => {
    const [fromRow, fromCol] = from;
    const [toRow, toCol] = to;
    
    // Rook can only move in straight lines
    if (fromRow !== toRow && fromCol !== toCol) {
      return false;
    }
    
    // Check if path is clear
    if (fromRow === toRow) { // Horizontal move
      const start = Math.min(fromCol, toCol);
      const end = Math.max(fromCol, toCol);
      for (let col = start + 1; col < end; col++) {
        if (board[fromRow][col]) return false;
      }
    } else { // Vertical move
      const start = Math.min(fromRow, toRow);
      const end = Math.max(fromRow, toRow);
      for (let row = start + 1; row < end; row++) {
        if (board[row][fromCol]) return false;
      }
    }
    
    return true;
  };
  
  export const isValidKnightMove = (from, to) => {
    const [fromRow, fromCol] = from;
    const [toRow, toCol] = to;
    
    const rowDiff = Math.abs(fromRow - toRow);
    const colDiff = Math.abs(fromCol - toCol);
    
    // Knight moves in an L shape: 2 squares in one direction and 1 square perpendicular
    return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
  };
  
  export const isValidBishopMove = (board, from, to) => {
    const [fromRow, fromCol] = from;
    const [toRow, toCol] = to;
    
    const rowDiff = Math.abs(fromRow - toRow);
    const colDiff = Math.abs(fromCol - toCol);
    
    // Bishop can only move diagonally
    if (rowDiff !== colDiff) {
      return false;
    }
    
    // Check if path is clear
    const rowStep = fromRow < toRow ? 1 : -1;
    const colStep = fromCol < toCol ? 1 : -1;
    
    let row = fromRow + rowStep;
    let col = fromCol + colStep;
    
    while (row !== toRow && col !== toCol) {
      if (board[row][col]) return false;
      row += rowStep;
      col += colStep;
    }
    
    return true;
  };
  
  export const isValidQueenMove = (board, from, to) => {
    // Queen combines rook and bishop movements
    return isValidRookMove(board, from, to) || isValidBishopMove(board, from, to);
  };
  
  export const isValidKingMove = (board, from, to, castlingRights) => {
    const [fromRow, fromCol] = from;
    const [toRow, toCol] = to;
    
    const rowDiff = Math.abs(fromRow - toRow);
    const colDiff = Math.abs(fromCol - toCol);
    
    // Regular king move (1 square in any direction)
    if (rowDiff <= 1 && colDiff <= 1) {
      return true;
    }
    
    // Check for castling
    const piece = board[fromRow][fromCol];
    const color = pieceColor(piece);
    
    if (rowDiff === 0 && colDiff === 2) {
      // Kingside castling
      if (color === 'white' && castlingRights.whiteKingside && fromRow === 7 && fromCol === 4 && toCol === 6) {
        return !board[7][5] && !board[7][6] && board[7][7] === PIECES.WHITE_ROOK;
      }
      if (color === 'black' && castlingRights.blackKingside && fromRow === 0 && fromCol === 4 && toCol === 6) {
        return !board[0][5] && !board[0][6] && board[0][7] === PIECES.BLACK_ROOK;
      }
      
      // Queenside castling
      if (color === 'white' && castlingRights.whiteQueenside && fromRow === 7 && fromCol === 4 && toCol === 2) {
        return !board[7][1] && !board[7][2] && !board[7][3] && board[7][0] === PIECES.WHITE_ROOK;
      }
      if (color === 'black' && castlingRights.blackQueenside && fromRow === 0 && fromCol === 4 && toCol === 2) {
        return !board[0][1] && !board[0][2] && !board[0][3] && board[0][0] === PIECES.BLACK_ROOK;
      }
    }
    
    return false;
  };
  
  export const isInCheck = (board, color) => {
    // Find the king position
    let kingRow = -1;
    let kingCol = -1;
    const kingPiece = color === 'white' ? PIECES.WHITE_KING : PIECES.BLACK_KING;
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (board[row][col] === kingPiece) {
          kingRow = row;
          kingCol = col;
          break;
        }
      }
      if (kingRow !== -1) break;
    }
    
    // Check if any opponent piece can capture the king
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece && pieceColor(piece) !== color) {
          if (isValidMove(board, [row, col], [kingRow, kingCol], {}, null)) {
            return true;
          }
        }
      }
    }
    
    return false;
  };
  
  export const getAllLegalMoves = (board, currentPlayer, castlingRights, enPassantTarget) => {
    const legalMoves = [];
    
    for (let fromRow = 0; fromRow < 8; fromRow++) {
      for (let fromCol = 0; fromCol < 8; fromCol++) {
        const piece = board[fromRow][fromCol];
        if (piece && pieceColor(piece) === currentPlayer) {
          for (let toRow = 0; toRow < 8; toRow++) {
            for (let toCol = 0; toCol < 8; toCol++) {
              if (isValidMove(board, [fromRow, fromCol], [toRow, toCol], castlingRights, enPassantTarget)) {
                // Make the move on a test board
                const testBoard = board.map(row => [...row]);
                testBoard[toRow][toCol] = testBoard[fromRow][fromCol];
                testBoard[fromRow][fromCol] = null;
                
                // Check if the move would leave the king in check
                if (!isInCheck(testBoard, currentPlayer)) {
                  legalMoves.push({
                    from: [fromRow, fromCol],
                    to: [toRow, toCol]
                  });
                }
              }
            }
          }
        }
      }
    }
    
    return legalMoves;
  };
  
  export const movePiece = (board, from, to, castlingRights, enPassantTarget) => {
    const [fromRow, fromCol] = from;
    const [toRow, toCol] = to;
    
    const piece = board[fromRow][fromCol];
    if (!piece) return { newBoard: board, newCastlingRights: castlingRights, newEnPassantTarget: null, promotionNeeded: false };
    
    const pieceType = piece.substring(1);
    const color = pieceColor(piece);
    
    const newBoard = board.map(row => [...row]);
    newBoard[toRow][toCol] = piece;
    newBoard[fromRow][fromCol] = null;
    
    // Handle special moves
    let promotionNeeded = false;
    let newCastlingRights = { ...castlingRights };
    let newEnPassantTarget = null;
    
    // Pawn promotion
    if (pieceType === 'P' && (toRow === 0 || toRow === 7)) {
      promotionNeeded = true;
    }
    
    // En passant capture
    if (pieceType === 'P' && Math.abs(fromCol - toCol) === 1 && !board[toRow][toCol]) {
      if (enPassantTarget && toRow === enPassantTarget[0] && toCol === enPassantTarget[1]) {
        // Remove captured pawn
        newBoard[fromRow][toCol] = null;
      }
    }
    
    // Update en passant target
    if (pieceType === 'P' && Math.abs(fromRow - toRow) === 2) {
      newEnPassantTarget = [fromRow + (toRow - fromRow) / 2, fromCol];
    }
    
    // Handle castling
    if (pieceType === 'K' && Math.abs(fromCol - toCol) === 2) {
      // Kingside castling
      if (toCol === 6) {
        newBoard[fromRow][5] = newBoard[fromRow][7]; // Move rook
        newBoard[fromRow][7] = null;
      }
      // Queenside castling
      else if (toCol === 2) {
        newBoard[fromRow][3] = newBoard[fromRow][0]; // Move rook
        newBoard[fromRow][0] = null;
      }
    }
    
    // Update castling rights
    if (pieceType === 'K') {
      if (color === 'white') {
        newCastlingRights.whiteKingside = false;
        newCastlingRights.whiteQueenside = false;
      } else {
        newCastlingRights.blackKingside = false;
        newCastlingRights.blackQueenside = false;
      }
    }
    
    if (pieceType === 'R') {
      if (color === 'white') {
        if (fromRow === 7 && fromCol === 0) newCastlingRights.whiteQueenside = false;
        if (fromRow === 7 && fromCol === 7) newCastlingRights.whiteKingside = false;
      } else {
        if (fromRow === 0 && fromCol === 0) newCastlingRights.blackQueenside = false;
        if (fromRow === 0 && fromCol === 7) newCastlingRights.blackKingside = false;
      }
    }
    
    return { newBoard, newCastlingRights, newEnPassantTarget, promotionNeeded };
  };
  
  export const boardToFEN = (board, currentPlayer, castlingRights, enPassantTarget, halfMoveClock, fullMoveNumber) => {
    const fenParts = [];
    
    // 1. Piece placement
    for (let row = 0; row < 8; row++) {
      let emptyCount = 0;
      let rowStr = '';
      
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece) {
          if (emptyCount > 0) {
            rowStr += emptyCount;
            emptyCount = 0;
          }
          
          const pieceChar = piece[1];
          rowStr += piece[0] === 'w' ? pieceChar : pieceChar.toLowerCase();
        } else {
          emptyCount++;
        }
      }
      
      if (emptyCount > 0) {
        rowStr += emptyCount;
      }
      
      fenParts.push(rowStr);
    }
    
    // 2. Active color
    const activeColor = currentPlayer === 'white' ? 'w' : 'b';
    
    // 3. Castling availability
    let castling = '';
    if (castlingRights.whiteKingside) castling += 'K';
    if (castlingRights.whiteQueenside) castling += 'Q';
    if (castlingRights.blackKingside) castling += 'k';
    if (castlingRights.blackQueenside) castling += 'q';
    if (!castling) castling = '-';
    
    // 4. En passant target square
    let enPassant = '-';
    if (enPassantTarget) {
      const col = 'abcdefgh'[enPassantTarget[1]];
      const row = 8 - enPassantTarget[0];
      enPassant = `${col}${row}`;
    }
    
    // Combine all parts
    return `${fenParts.join('/')} ${activeColor} ${castling} ${enPassant} ${halfMoveClock} ${fullMoveNumber}`;
  };
  
  export const boardToPGN = (moveHistory) => {
    let pgn = '';
    let moveNumber = 1;
    
    for (let i = 0; i < moveHistory.length; i += 2) {
      pgn += `${moveNumber}. ${moveHistory[i]} `;
      if (i + 1 < moveHistory.length) {
        pgn += `${moveHistory[i + 1]} `;
      }
      moveNumber++;
    }
    
    return pgn.trim();
  };
  
  export const moveToAlgebraic = (board, from, to, promotionPiece = null) => {
    const [fromRow, fromCol] = from;
    const [toRow, toCol] = to;
    
    const piece = board[fromRow][fromCol];
    if (!piece) return '';
    
    const pieceType = piece[1];
    const pieceSymbol = pieceType === 'P' ? '' : pieceType;
    
    const fromFile = 'abcdefgh'[fromCol];
    const fromRank = 8 - fromRow;
    const toFile = 'abcdefgh'[toCol];
    const toRank = 8 - toRow;
    
    let moveStr = '';
    
    // Castling
    if (pieceType === 'K' && Math.abs(fromCol - toCol) === 2) {
      return toCol > fromCol ? 'O-O' : 'O-O-O';
    }
    
    // Piece symbol
    moveStr += pieceSymbol;
    
    // Capture indication
    const targetPiece = board[toRow][toCol];
    if (targetPiece) {
      if (pieceType === 'P') {
        moveStr += fromFile;
      }
      moveStr += 'x';
    } else if (pieceType === 'P' && fromCol !== toCol) {
      // En passant capture
      moveStr += `${fromFile}x`;
    }
    
    // Destination square
    moveStr += `${toFile}${toRank}`;
    
    // Promotion
    if (promotionPiece) {
      moveStr += `=${promotionPiece}`;
    }
    
    return moveStr;
  };
  
  export const getGameState = (board, currentPlayer, legalMoves) => {
    if (legalMoves.length === 0) {
      return isInCheck(board, currentPlayer) ? 'checkmate' : 'stalemate';
    }
    
    if (isInCheck(board, currentPlayer)) {
      return 'check';
    }
    
    return 'ongoing';
  };
  
  export const convertToAlgebraicNotation = (move) => {
    const [fromRow, fromCol] = move.from;
    const [toRow, toCol] = move.to;
    
    const fromSquare = `${String.fromCharCode(97 + fromCol)}${8 - fromRow}`;
    const toSquare = `${String.fromCharCode(97 + toCol)}${8 - toRow}`;
    
    return `${fromSquare}${toSquare}`;
  };
  
  export const convertFromAlgebraicNotation = (notation) => {
    if (notation.length !== 4) return null;
    
    const fromCol = notation.charCodeAt(0) - 97;
    const fromRow = 8 - parseInt(notation[1]);
    const toCol = notation.charCodeAt(2) - 97;
    const toRow = 8 - parseInt(notation[3]);
    
    return {
      from: [fromRow, fromCol],
      to: [toRow, toCol]
    };
  };