import { io, Socket } from "socket.io-client";

// Event dari server ke client
export interface ServerToClientEvents {
  updateRoom: (roomData: Room) => void;
  errorMsg: (msg: string) => void;
}

// Event dari client ke server
export interface ClientToServerEvents {
  createRoom: (data: { roomId: string; name: string }) => void;
  joinRoom: (data: { roomId: string; name: string }) => void;
  startGame: (data: { roomId: string }) => void;
  nextPhase: (data: { roomId: string }) => void;
  vote: (data: { roomId: string; target: string }) => void;
  nightAction: (data: { roomId: string; target: string }) => void;
}

// Definisi Player & Room
export interface Player {
  id: string;
  name: string;
  alive: boolean;
  role: string | null;
}

export interface NightAction {
  player: string;
  name: string;
  role: string;
  target: string;
}

export interface Room {
  admin: string | null;
  players: Player[];
  phase: "waiting" | "day" | "night" | "ended";
  log: string[];
  votes: Record<string, string>;
  nightActions: Record<string, NightAction>;
}

// Socket ter-typed
export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  "http://localhost:3001", // ganti dengan URL backendmu
  { transports: ["websocket"] }
);
