
export interface Attempt {
  elapsed: number;
  diff: number;
  at: string; // ISO Date String
}

export interface PlayerRecord {
  id: string; // UUID
  name: string;
  color: string; // hex
  attempts: Attempt[];
}

export interface GameSession {
  id: string; // UUID
  createdAt: string; // ISO Date String
  goalTime: number;
  players: PlayerRecord[];
}
