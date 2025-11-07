"use client";
import { useEffect, useState } from "react";
import { socket } from "../../utils/socket";

export default function AdminPage() {
  const [room, setRoom] = useState<any>(null);
  const [roomId, setRoomId] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole !== "admin") {
      alert("Kamu bukan admin!");
      window.location.href = "/";
      return;
    }

    const storedRoomId = localStorage.getItem("roomId") || "room1";
    const storedName = localStorage.getItem("name") || "Admin";

    setRoomId(storedRoomId);
    setName(storedName);

    // 🔥 Buat room hanya sekali
    socket.emit("createRoom", { roomId: storedRoomId, name: storedName });

    socket.on("updateRoom", (data) => setRoom(data));
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
            {p.name} — {p.role || "Belum ada role"} — {p.alive ? "Alive" : "Dead"}
          </li>
        ))}
      </ul>

      <button
        onClick={() => socket.emit("startGame", roomId)}
        disabled={room.phase !== "lobby"}
      >
        Mulai Game
      </button>

      <h3>Game Log</h3>
      <ul>
        {room.log.map((l: string, i: number) => (
          <li key={i}>{l}</li>
        ))}
      </ul>
    </div>
  );
}
