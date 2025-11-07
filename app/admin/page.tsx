"use client";
import { useEffect, useState } from "react";
import { socket } from "../../utils/socket";

export default function AdminPage() {
  const [room, setRoom] = useState<any>(null);
  const [roomId, setRoomId] = useState("room1"); // default room id
  const [name, setName] = useState("Admin"); // nama admin kamu

  useEffect(() => {
    // saat pertama connect, admin create room
    socket.emit("createRoom", { roomId, name });

    // dengarkan updateRoom
    socket.on("updateRoom", (data) => {
      console.log("Update room data:", data);
      setRoom(data);
    });

    // error message
    socket.on("errorMsg", (msg) => alert(msg));

    return () => {
      socket.off("updateRoom");
      socket.off("errorMsg");
    };
  }, []);

  if (!room) return <p>Menunggu data room...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Panel</h2>
      <h3>Room ID: {roomId}</h3>

      <ul>
        {room.players.map((p: any) => (
          <li key={p.id}>
            {p.name} — {p.role || "No role yet"} — {p.alive ? "Alive" : "Dead"}
          </li>
        ))}
      </ul>

      <button
        onClick={() => socket.emit("startGame", roomId)}
        disabled={room.phase !== "lobby"}
      >
        Mulai Game
      </button>

      <h3>Log Game</h3>
      <ul>
        {room.log.map((l: string, i: number) => (
          <li key={i}>{l}</li>
        ))}
      </ul>
    </div>
  );
}
