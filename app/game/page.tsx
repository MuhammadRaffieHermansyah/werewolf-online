"use client";
import { useEffect, useState } from "react";
import { socket } from "../../utils/socket";

export default function GamePage() {
  const [room, setRoom] = useState<any>(null);
  const [me, setMe] = useState<any>(null);

  const roomId = "room1"; // ID unik room
  const adminName = "Admin"; // nama admin

  useEffect(() => {
    // 🟢 Admin CREATE ROOM, bukan join
    socket.emit("createRoom", { roomId, name: adminName });

    socket.on("updateRoom", (data) => {
      setRoom(data);
      const player = data.players.find((p: any) => p.id === socket.id);
      setMe(player);
    });

    socket.on("errorMsg", (msg) => alert(msg));

    return () => {
      socket.off("updateRoom");
      socket.off("errorMsg");
    };
  }, []);

  if (!room || !me) return <p>Menunggu data room...</p>;

  return (
    <div style={styles.container}>
      <h2>Game Room (Admin)</h2>
      <p>
        <strong>Phase:</strong> {room.phase}
      </p>

      <h3>Players</h3>
      <ul style={styles.list}>
        {room.players.map((p: any) => (
          <li key={p.id}>
            {p.name} — {p.role ?? "Belum ada role"} —{" "}
            {p.alive ? "Alive" : "Dead"}
          </li>
        ))}
      </ul>

      {room.phase === "lobby" && (
        <button
          onClick={() => socket.emit("startGame", roomId)}
          style={styles.button}
        >
          Mulai Game
        </button>
      )}

      <h3>Game Log</h3>
      <ul style={styles.log}>
        {room.log.map((l: string, i: number) => (
          <li key={i}>{l}</li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 600,
    margin: "auto",
    padding: 20,
    background: "#fafafa",
    borderRadius: 8,
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  list: { listStyle: "none", padding: 0 },
  log: { background: "#eee", padding: 10, borderRadius: 6, listStyle: "none" },
  button: {
    padding: "10px 20px",
    background: "#0070f3",
    color: "#fff",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
    marginTop: 10,
  },
};
