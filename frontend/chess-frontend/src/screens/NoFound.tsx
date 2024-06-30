import { Home, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';

const NotFound = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovering) {
        setPosition({
          x: Math.random() * window.innerWidth * 0.8,
          y: Math.random() * window.innerHeight * 0.8,
        });
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isHovering]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 to-indigo-900 flex flex-col items-center justify-center text-white p-4">
      <h1 className="text-9xl font-extrabold mb-4 animate-bounce">404</h1>
      <p className="text-2xl mb-8 text-center">Oops! Looks like you've wandered into the void.</p>
      
      <div className="relative w-64 h-64 mb-12">
        <div 
          className="absolute transition-all duration-1000 ease-in-out transform hover:scale-110"
          style={{ left: `${position.x}px`, top: `${position.y}px` }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-purple-700 text-4xl animate-spin">
            ?
          </div>
        </div>
      </div>
      
      <p className="text-xl mb-8 text-center">
        Don't worry, even the best explorers get lost sometimes!
      </p>
      
      <div className="flex space-x-4">
        <a 
          href="/"
          className="bg-white text-purple-700 px-6 py-3 rounded-full font-bold flex items-center transition-transform transform hover:scale-105"
        >
          <Home className="mr-2" />
          Go Home
        </a>
        <button 
          onClick={() => window.location.reload()}
          className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-full font-bold flex items-center transition-transform transform hover:scale-105"
        >
          <RefreshCw className="mr-2" />
          Try Again
        </button>
      </div>
    </div>
  );
};

export default NotFound;