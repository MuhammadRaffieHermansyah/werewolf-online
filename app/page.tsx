"use client";
import { useState, useEffect } from "react";
import { socket } from "../utils/socket";

interface Player {
  id: string;
  name: string;
  alive: boolean;
  role?: string;
}

interface Room {
  phase: string;
  players: Player[];
  host: string;
  log: string[];
}

export default function Home() {
  const [roomId, setRoomId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [room, setRoom] = useState<Room | null>(null);
  const [joined, setJoined] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    socket.on("updateRoom", (roomData: Room) => setRoom({ ...roomData }));
    socket.on("errorMsg", (msg: string) => setError(msg));

    return () => {
      socket.off("updateRoom");
      socket.off("errorMsg");
    };
  }, []);

  const createRoom = () => {
    if (!name || !roomId) {
      setError("Nama dan Room ID harus diisi!");
      return;
    }
    socket.emit("createRoom", { roomId, name });
    setJoined(true);
  };

  const joinRoom = () => {
    if (!name || !roomId) {
      setError("Nama dan Room ID harus diisi!");
      return;
    }
    socket.emit("joinRoom", { roomId, name });
    setJoined(true);
  };

  const startGame = () => {
    socket.emit("startGame", roomId);
  };

  const voteOut = (target: string) => {
    socket.emit("vote", { roomId, target });
  };

  // --- UI bagian belum join room ---
  if (!joined)
    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
        <h2 className="text-3xl font-bold mb-6">Werewolf Online</h2>
        <div className="flex flex-col gap-3 w-64">
          <input
            className="border rounded p-2"
            placeholder="Nama kamu"
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="border rounded p-2"
            placeholder="ID Room (bebas)"
            onChange={(e) => setRoomId(e.target.value)}
          />
          <div className="flex justify-between mt-2">
            <button
              className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
              onClick={createRoom}
            >
              Create Room
            </button>
            <button
              className="bg-green-500 text-white rounded px-4 py-2 hover:bg-green-600"
              onClick={joinRoom}
            >
              Join Room
            </button>
          </div>
          {error && <p className="text-red-500 mt-3">{error}</p>}
        </div>
      </main>
    );

  // --- UI bagian sudah join room ---
  return (
    <main className="p-6">
      <h2 className="text-2xl font-bold mb-4">Room: {roomId}</h2>
      {room && (
        <>
          <p className="mb-2">Phase: {room.phase}</p>
          <ul className="mb-4">
            {room.players.map((p) => (
              <li key={p.id}>
                {p.name} — {p.alive ? "Alive" : "Dead"}{" "}
                {p.role && `(Role: ${p.role})`}
              </li>
            ))}
          </ul>

          {room.phase === "lobby" && room.host === socket.id && (
            <button
              className="bg-purple-500 text-white rounded px-4 py-2 hover:bg-purple-600 mb-4"
              onClick={startGame}
            >
              Start Game
            </button>
          )}

          {room.phase === "night" && (
            <p className="text-gray-500 mb-4">Night phase in progress...</p>
          )}
          {room.phase === "ended" && (
            <p className="text-gray-500 mb-4">Game ended!</p>
          )}

          {room.phase === "day" &&
            room.players
              .filter((p) => p.alive)
              .map((p) => (
                <button
                  key={p.id}
                  className="bg-red-500 text-white rounded px-4 py-2 m-1 hover:bg-red-600"
                  onClick={() => voteOut(p.name)}
                >
                  Vote {p.name}
                </button>
              ))}

          <h3 className="text-lg font-semibold mt-6 mb-2">Log:</h3>
          <ul className="text-sm text-gray-700">
            {room.log.map((l, i) => (
              <li key={i}>{l}</li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
