
import { useState, useRef, useCallback } from 'react';

export const useStopwatch = () => {  
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  
  const rafId = useRef<number | null>(null);
  const startTime = useRef<number | null>(null);

  const animate = (time: number) => {
    if (startTime.current === null) {
      startTime.current = time;
    }
    const timePassed = time - startTime.current;
    setElapsedTime(timePassed / 1000);
    rafId.current = requestAnimationFrame(animate);
  };

  const start = useCallback(() => {
    if (!isRunning) {
      setIsRunning(true);
      startTime.current = performance.now() - (elapsedTime * 1000);
      rafId.current = requestAnimationFrame(animate);
    }
  }, [isRunning, elapsedTime]);

  const stop = useCallback((): number => {
    if (isRunning) {
      setIsRunning(false);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
      rafId.current = null;
    }
    return elapsedTime;
  }, [isRunning, elapsedTime]);

  const reset = useCallback(() => {
    stop();
    setElapsedTime(0);
  }, [stop]);

  return { elapsedTime, isRunning, start, stop, reset };
};
