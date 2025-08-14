
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { useStopwatch } from '../hooks/useStopwatch';
import { useGame } from '../context/GameContext';
import { PlayerRecord } from '../types';
import TimerDisplay from '../components/TimerDisplay';
import ResultCard from '../components/ResultCard';

enum GameState {
  READY,
  RUNNING,
  RESULT,
}

const Game: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.READY);
  const { elapsedTime, isRunning, start, stop, reset } = useStopwatch();
  const { currentPlayer, addPlayerAttempt, startNextPlayer, getRankings } = useGame();
  const [lastAttemptPlayer, setLastAttemptPlayer] = useState<PlayerRecord | null>(null);
  const [rank, setRank] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  
  const handleAction = useCallback(() => {
    if (gameState === GameState.READY) {
      reset();
      start();
      setGameState(GameState.RUNNING);
    } else if (gameState === GameState.RUNNING) {
      stop();
      const stoppedTime = elapsedTime;
      const updatedPlayer = addPlayerAttempt(stoppedTime);
      setLastAttemptPlayer(updatedPlayer);
      
      const rankings = getRankings();
      const playerRank = rankings.findIndex(p => p.id === updatedPlayer.id) + 1;
      setRank(playerRank);

      if (playerRank === 1 && updatedPlayer.attempts.length > 0 && Math.min(...updatedPlayer.attempts.map(a => a.diff)) === updatedPlayer.attempts[updatedPlayer.attempts.length-1].diff) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000); // Confetti for 5 seconds
        if(window.navigator.vibrate) window.navigator.vibrate([200, 100, 200]);
      }
      
      setGameState(GameState.RESULT);
    } else if (gameState === GameState.RESULT) {
      startNextPlayer();
      setGameState(GameState.READY);
      reset();
    }
  }, [gameState, start, stop, reset, addPlayerAttempt, elapsedTime, getRankings, startNextPlayer]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === 'Enter') {
        e.preventDefault();
        handleAction();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleAction]);

  const getButtonText = () => {
    switch (gameState) {
      case GameState.READY: return '시작';
      case GameState.RUNNING: return '지금!';
      case GameState.RESULT: return '다음 플레이어';
    }
  };

  const getButtonColor = () => {
    switch (gameState) {
      case GameState.READY: return 'bg-green-400 hover:bg-green-500';
      case GameState.RUNNING: return 'bg-red-500 hover:bg-red-600';
      case GameState.RESULT: return 'bg-blue-500 hover:bg-blue-600';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-8">
       {showConfetti && <Confetti recycle={false} numberOfPieces={400} colors={['#FF0000', '#0000FF', '#FFFFFF', '#000000']} />}
      
      <div className="absolute top-20 text-center">
         {currentPlayer && gameState !== GameState.RESULT &&
            <motion.div
                key={currentPlayer.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <span className="text-xl font-bold px-4 py-2 rounded-full border-2 border-black" style={{ backgroundColor: currentPlayer.color }}>
                    {currentPlayer.name}
                </span>
            </motion.div>
         }
      </div>

      <div className="flex-grow flex items-center justify-center">
        {gameState === GameState.RESULT && lastAttemptPlayer ? (
          <ResultCard player={lastAttemptPlayer} rank={rank} />
        ) : (
          <TimerDisplay time={elapsedTime} />
        )}
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleAction}
        className={`w-full max-w-xs text-3xl font-bold text-white py-4 rounded-lg border-4 border-black shadow-[6px_6px_0px_#000] transition-all duration-200 ${getButtonColor()}`}
      >
        {getButtonText()}
      </motion.button>
    </div>
  );
};

export default Game;
