import { io, Socket } from "socket.io-client";

export interface ServerToClientEvents {
  updateRoom: (roomData: Room) => void;
  errorMsg: (msg: string) => void;
}

export interface ClientToServerEvents {
  createRoom: (data: { roomId: string; name: string }) => void;
  joinRoom: (data: { roomId: string; name: string }) => void;
  startGame: (data: { roomId: string }) => void;
  nextPhase: (data: { roomId: string }) => void;
  vote: (data: { roomId: string; target: string }) => void;
  nightAction: (data: { roomId: string; target: string }) => void;
}

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

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  "https://anthracitic-drake-interprovincial.ngrok-free.dev/", 
  { transports: ["websocket"] }
);
