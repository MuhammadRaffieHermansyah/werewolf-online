import { io, Socket } from "socket.io-client";

interface ServerToClientEvents {
    updateRoom: (roomData: any) => void;
    errorMsg: (msg: string) => void;
}

interface ClientToServerEvents {
    createRoom: (data: { roomId: string; name: string }) => void;
    joinRoom: (data: { roomId: string; name: string }) => void;
    startGame: (roomId: string) => void;
    vote: (data: { roomId: string; target: string }) => void;
}

// Pastikan URL sesuai dengan backend kamu
export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
    "https://anthracitic-drake-interprovincial.ngrok-free.dev",
    {
        transports: ["websocket"], // lebih stabil di dev mode
    }
);
