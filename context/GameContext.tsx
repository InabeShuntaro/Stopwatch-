
import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import { GameSession, PlayerRecord, Attempt } from '../types';
import { getSessionsFromStorage, saveSessionsToStorage } from '../services/storage';
import { GOAL_TIME, PRESET_NAMES, COLOR_PALETTE, MAX_SESSIONS } from '../constants';

interface GameContextType {
  sessions: GameSession[];
  currentSession: GameSession | null;
  currentPlayer: PlayerRecord | null;
  startNewGame: () => void;
  addPlayerAttempt: (elapsed: number) => PlayerRecord;
  startNextPlayer: () => void;
  resetAllData: () => void;
  getRankings: () => PlayerRecord[];
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [currentSession, setCurrentSession] = useState<GameSession | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<PlayerRecord | null>(null);

  useEffect(() => {
    const loadedSessions = getSessionsFromStorage();
    setSessions(loadedSessions);
    if (loadedSessions.length > 0) {
        // Continue with the latest session if page is reloaded
        const latestSession = loadedSessions[0];
        setCurrentSession(latestSession);
        if (latestSession.players.length > 0) {
            setCurrentPlayer(latestSession.players[latestSession.players.length - 1]);
        } else {
            startNextPlayerInSession(latestSession);
        }
    } else {
        startNewGame();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persistSessions = (newSessions: GameSession[]) => {
    setSessions(newSessions);
    saveSessionsToStorage(newSessions);
  };
  
  const createNewPlayer = (session: GameSession): PlayerRecord => {
    const usedNames = new Set(session.players.map(p => p.name));
    const availableNames = PRESET_NAMES.filter(name => !usedNames.has(name));
    const name = availableNames.length > 0 ? availableNames[Math.floor(Math.random() * availableNames.length)] : `Player ${session.players.length + 1}`;
    
    const usedColors = new Set(session.players.map(p => p.color));
    const availableColors = COLOR_PALETTE.filter(color => !usedColors.has(color));
    const color = availableColors.length > 0 ? availableColors[Math.floor(Math.random() * availableColors.length)] : `#${Math.floor(Math.random()*16777215).toString(16)}`;

    return {
      id: crypto.randomUUID(),
      name,
      color,
      attempts: [],
    };
  }

  const startNewGame = useCallback(() => {
    const newSession: GameSession = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      goalTime: GOAL_TIME,
      players: [],
    };
    const newPlayer = createNewPlayer(newSession);
    newSession.players.push(newPlayer);

    const updatedSessions = [newSession, ...sessions].slice(0, MAX_SESSIONS);
    persistSessions(updatedSessions);
    setCurrentSession(newSession);
    setCurrentPlayer(newPlayer);
  }, [sessions]);

  const startNextPlayerInSession = (session: GameSession) => {
      const newPlayer = createNewPlayer(session);
      const updatedSession = { ...session, players: [...session.players, newPlayer]};
      
      const sessionIndex = sessions.findIndex(s => s.id === session.id);
      if (sessionIndex !== -1) {
          const updatedSessions = [...sessions];
          updatedSessions[sessionIndex] = updatedSession;
          persistSessions(updatedSessions);
      }
      setCurrentSession(updatedSession);
      setCurrentPlayer(newPlayer);
  }

  const startNextPlayer = useCallback(() => {
      if (currentSession) {
          startNextPlayerInSession(currentSession);
      }
  }, [currentSession, sessions]);


  const addPlayerAttempt = useCallback((elapsed: number): PlayerRecord => {
    if (!currentSession || !currentPlayer) {
      throw new Error("No active game or player.");
    }

    const newAttempt: Attempt = {
      elapsed,
      diff: Math.abs(elapsed - GOAL_TIME),
      at: new Date().toISOString(),
    };

    const updatedPlayer = {
      ...currentPlayer,
      attempts: [...currentPlayer.attempts, newAttempt],
    };

    const updatedPlayers = currentSession.players.map(p =>
      p.id === updatedPlayer.id ? updatedPlayer : p
    );

    const updatedSession = { ...currentSession, players: updatedPlayers };

    const updatedSessions = sessions.map(s =>
      s.id === updatedSession.id ? updatedSession : s
    );

    persistSessions(updatedSessions);
    setCurrentSession(updatedSession);
    setCurrentPlayer(updatedPlayer);
    return updatedPlayer;
  }, [currentSession, currentPlayer, sessions]);
  
  const getRankings = useCallback((): PlayerRecord[] => {
      if (!currentSession) return [];
      return [...currentSession.players]
          .filter(p => p.attempts.length > 0)
          .sort((a, b) => {
              const diffA = Math.min(...a.attempts.map(att => att.diff));
              const diffB = Math.min(...b.attempts.map(att => att.diff));
              return diffA - diffB;
          });
  }, [currentSession]);


  const resetAllData = useCallback(() => {
    persistSessions([]);
    setCurrentSession(null);
    setCurrentPlayer(null);
    startNewGame();
  }, [startNewGame]);

  return (
    <GameContext.Provider value={{ sessions, currentSession, currentPlayer, startNewGame, addPlayerAttempt, startNextPlayer, resetAllData, getRankings }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
