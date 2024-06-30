import { Chess, Color, PieceSymbol, Square } from "chess.js";
import React, { useEffect, useState } from 'react';

type ChessPiece = {
  square: Square;
  type: PieceSymbol;
  color: Color;
};

type ChessboardProps = {
  setBoard: React.Dispatch<React.SetStateAction<(ChessPiece | null)[][]>>;
  board: (ChessPiece | null)[][];
  socket: WebSocket;
  chess: Chess;
};

const pieceUnicodes: Record<Color, Record<PieceSymbol, string>> = {
  b: {
    p: '♟',
    n: '♞',
    b: '♝',
    r: '♜',
    q: '♛',
    k: '♚'
  },
  w: {
    p: '♙',
    n: '♘',
    b: '♗',
    r: '♖',
    q: '♕',
    k: '♔'
  }
};

const MOVE = "move";

function Chessboard({ board, socket, setBoard, chess }: ChessboardProps) {
  const [from, setFrom] = useState<Square | null>(null);
  const [to, setTo] = useState<Square | null>(null);
  const [legalMoves, setLegalMoves] = useState<Square[]>([]);

  useEffect(() => {
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'update') {
        setBoard(chess.board());
      }
    };
  }, [socket, chess, setBoard]);

  const handleSquareClick = (rowIndex: number, colIndex: number) => {
    const clickedSquare = `${String.fromCharCode(97 + colIndex)}${8 - rowIndex}` as Square;
    
    if (!from) {
      const moves = chess.moves({ square: clickedSquare, verbose: true });
      if (moves.length > 0) {
        setFrom(clickedSquare);
        setLegalMoves(moves.map(move => move.to));
      }
    } else {
      if (clickedSquare === from) {
        // Deselect the piece if clicked again
        setFrom(null);
        setLegalMoves([]);
      } else if (legalMoves.includes(clickedSquare)) {
        setTo(clickedSquare);
        const move = { from, to: clickedSquare };
        const result = chess.move(move);
        if (result) {
          setBoard(chess.board());
          socket.send(JSON.stringify({ type: MOVE, move: `${from}-${clickedSquare}` }));
        }
        setFrom(null);
        setTo(null);
        setLegalMoves([]);
      } else {
        // If clicked on an invalid square, reset selection
        setFrom(null);
        setLegalMoves([]);
      }
    }
  };

  return (
    <div className="inline-block border-4 border-gray-700 bg-gray-700">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="flex">
          {row.map((piece, colIndex) => {
            const isWhiteSquare = (rowIndex + colIndex) % 2 === 0;
            const squareColor = isWhiteSquare ? 'bg-amber-200' : 'bg-amber-800';
            const pieceColor = piece?.color === 'w' ? 'text-white' : 'text-black';
            const currentSquare = `${String.fromCharCode(97 + colIndex)}${8 - rowIndex}` as Square;
            const isSelected = from === currentSquare;
            const isLegalMove = legalMoves.includes(currentSquare);

            return (
              <div
                key={colIndex}
                className={`w-16 h-16 flex items-center justify-center ${squareColor} 
                  ${isSelected ? 'ring-2 ring-blue-500' : ''} 
                  ${isLegalMove ? 'ring-2 ring-green-500' : ''} 
                  cursor-pointer`}
                onClick={() => handleSquareClick(rowIndex, colIndex)}
              >
                {piece && (
                  <span className={`text-4xl ${pieceColor}`}>
                    {pieceUnicodes[piece.color][piece.type]}
                  </span>
                )}
                {isLegalMove && !piece && (
                  <div className="w-3 h-3 rounded-full bg-green-500 opacity-50" />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default Chessboard;
