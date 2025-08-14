
import { GameSession } from '../types';
import { STORAGE_KEY } from '../constants';

export const getSessionsFromStorage = (): GameSession[] => {
  try {
    const sessionsJSON = localStorage.getItem(STORAGE_KEY);
    return sessionsJSON ? JSON.parse(sessionsJSON) : [];
  } catch (error) {
    console.error("Failed to load sessions from local storage:", error);
    return [];
  }
};

export const saveSessionsToStorage = (sessions: GameSession[]): void => {
  try {
    const sessionsJSON = JSON.stringify(sessions);
    localStorage.setItem(STORAGE_KEY, sessionsJSON);
  } catch (error) {
    console.error("Failed to save sessions to local storage:", error);
  }
};
