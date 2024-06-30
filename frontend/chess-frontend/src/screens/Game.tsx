import { Chess, Move } from "chess.js";
import { ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import Chessboard from "../components/Chessboard";
import { useSocket } from "../hook/useSocket";

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";

type GameMessage = {
  type: typeof INIT_GAME | typeof MOVE | typeof GAME_OVER;
  payload?: Move;
};

function Game() {
  const socket = useSocket();
  const [chess, setChess] = useState(() => new Chess());
  const [board, setBoard] = useState(() => chess.board());
  const [gameStatus, setGameStatus] = useState<string | null>(null);

  const updateGameState = useCallback((newChess: Chess) => {
    setChess(newChess);
    setBoard(newChess.board());
    if (newChess.isGameOver()) {
      setGameStatus(newChess.isCheckmate() ? "Checkmate!" : "Game Over");
    } else if (newChess.isCheck()) {
      setGameStatus("Check!");
    } else {
      setGameStatus(null);
    }
  }, []);

  const handleMessage = useCallback((message: GameMessage) => {
    console.log("Received message:", message);
    switch (message.type) {
      case INIT_GAME: {
        const newChess = new Chess();
        updateGameState(newChess);
        console.log("Game initialized");
        break;
      }
      case MOVE: {
        if (message.payload) {
          const newChess = new Chess(chess.fen());
          newChess.move(message.payload);
          updateGameState(newChess);
          console.log("Move applied");
        }
        break;
      }
      case GAME_OVER: {
        setGameStatus("Game Over");
        console.log("Game over");
        break;
      }
    }
  }, [chess, updateGameState]);

  useEffect(() => {
    if (!socket) return;

    const messageHandler = (event: MessageEvent) => {
      const message: GameMessage = JSON.parse(event.data);
      handleMessage(message);
    };

    socket.addEventListener('message', messageHandler);

    return () => {
      socket.removeEventListener('message', messageHandler);
    };
  }, [socket, handleMessage]);

  const startNewGame = useCallback(() => {
    if (socket) {
      socket.send(JSON.stringify({ type: INIT_GAME }));
    }
  }, [socket]);

  if (!socket) {
    return <div className="text-center mt-8 text-white">Connecting to server...</div>;
  }

  return (
    <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
      <div className="max-w-4xl w-full p-8 bg-zinc-700 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-white">Chess Game</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Chessboard chess={chess} setBoard={setBoard} socket={socket} board={board} />
          </div>
          <div className="flex flex-col justify-between">
            {gameStatus && (
              <div className="mb-4 p-3 bg-blue-500 text-white rounded">
                {gameStatus}
              </div>
            )}
            <button
              onClick={startNewGame}
              className="bg-green-600 p-4 text-white text-lg font-bold hover:bg-green-700 rounded-xl transition duration-300 ease-in-out transform hover:scale-105 shadow-md flex items-center justify-center"
            >
              <ChevronRight className="mr-2" size={24} />
              Start New Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Game;