
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DigitProps {
  char: string;
}

const Digit: React.FC<DigitProps> = ({ char }) => {
  const isDigit = !isNaN(parseInt(char, 10));
  
  return (
    <div className="relative w-[1.1ch] h-[1.5em] tabular-nums">
      <AnimatePresence initial={false}>
        <motion.span
          key={char}
          initial={{ y: '100%', opacity: 0, rotateX: -90 }}
          animate={{ y: '0%', opacity: 1, rotateX: 0 }}
          exit={{ y: '-100%', opacity: 0, rotateX: 90 }}
          transition={{ duration: isDigit ? 0.2 : 0, ease: 'easeInOut' }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {char}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

interface TimerDisplayProps {
  time: number;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ time }) => {
  const timeString = time.toFixed(2);
  const chars = timeString.split('');

  return (
    <div className="flex items-center justify-center font-orbitron text-7xl md:text-9xl font-black tracking-tighter text-black bg-white/50 border-4 border-black p-4 shadow-[8px_8px_0px_#000]">
      {chars.map((char, index) => (
        <Digit key={`${char}-${index}`} char={char} />
      ))}
      <span className="text-4xl md:text-6xl self-end ml-2 pb-2">s</span>
    </div>
  );
};

export default React.memo(TimerDisplay);
