import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BoardProps {
  piece: string;
  color: string;
}

const ChessPiece = ({ piece, color }: BoardProps) => (
  <div className={`text-5xl ${color === 'white' ? 'text-gray-100' : 'text-gray-900'} 
    transition-transform duration-200 hover:scale-110 cursor-pointer`}>
    {piece}
  </div>
);

const ChessSquare = ({ isLight, children }: { isLight: boolean, children: React.ReactNode }) => (
  <div className={`flex items-center justify-center ${isLight ? 'bg-amber-800' : 'bg-amber-200='} 
    transition-colors duration-200 hover:bg-amber-300`}>
    {children}
  </div>
);

const ChessBoard = () => {
  const initialBoard = [
    ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
    ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
    ...Array(4).fill(Array(8).fill(null)),
    ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
    ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖']
  ];

  return (
    <div className="grid grid-cols-8 w-full max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl aspect-square border-8 border-gray-900 rounded-lg overflow-hidden shadow-2xl">
      {initialBoard.flatMap((row, rowIndex) =>
        row.map((piece, colIndex) => (
          <ChessSquare key={`${rowIndex}-${colIndex}`} isLight={(rowIndex + colIndex) % 2 === 0}>
            {piece && <ChessPiece piece={piece} color={rowIndex < 2 ? 'black' : 'white'} />}
          </ChessSquare>
        ))
      )}
    </div>
  );
};

const StatButton = ({ text, icon, primary = false }: { text: string, icon: JSX.Element, primary?: boolean }) => (
  <button className={`w-full ${primary ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-700 hover:bg-gray-600'} 
    text-white py-3 px-6 rounded-lg text-xl font-semibold mb-3 flex items-center justify-between 
    transition duration-300 ease-in-out transform hover:scale-105 shadow-md`}>
    {text}
    {icon}
  </button>
);

const StatsDisplay = ({ gamesPlayed, playersOnline }: { gamesPlayed: number, playersOnline: number }) => (
  <div className="mb-6 bg-gray-800 p-6 rounded-lg shadow-inner">
    <p className="text-xl mb-2">
      <span className="font-bold text-green-400">{gamesPlayed.toLocaleString()}</span> Games Today
    </p>
    <p className="text-xl">
      <span className="font-bold text-green-400">{playersOnline.toLocaleString()}</span> Playing Now
    </p>
  </div>
);

const ChessWebsite = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <div className="flex flex-col md:flex-row bg-gray-800 p-8 rounded-xl shadow-2xl max-w-5xl w-full">
        <ChessBoard />
        <div className="md:ml-8 mt-8 md:mt-0 text-white flex-1">
          <h1 className="text-5xl font-bold mb-2 text-white">Play Chess Online</h1>
          <h2 className="text-2xl font-semibold mb-6 text-green-400">on the #1 Site!</h2>
          
          <StatsDisplay gamesPlayed={13245662} playersOnline={144401} />
          <div>
            <button onClick={() => navigate("/game")} className="bg-green-600 w-full p-4 relative text-xl font-bold hover:bg-green-800 rounded-xl transition duration-300 ease-in-out transform hover:scale-105 shadow-md">
              <span><ChevronRight className="absolute right-8" size={24} /></span> Play Online
            </button>
          </div>
          <p className="text-sm mb-4 text-gray-400">Play with someone at your level</p>
          <StatButton text="Play Computer" icon={<ChevronRight size={24} />} />
          <p className="text-sm text-gray-400">Play vs customizable training bots</p>
        </div>
      </div>
    </div>
  );
};

export default ChessWebsite;
