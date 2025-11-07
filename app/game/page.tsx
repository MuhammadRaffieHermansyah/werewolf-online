"use client";
import { useEffect, useState } from "react";
import { socket } from "../../utils/socket";

export default function AdminPage() {
  const [room, setRoom] = useState<any>(null);

  useEffect(() => {
    socket.on("updateRoom", (data) => {
      setRoom(data);
    });
    return () => {
      socket.off("updateRoom");
    };
  }, []);

  const startGame = () => {
    if (room) socket.emit("startGame", room.roomId);
  };

  if (!room) return <p>Menunggu data room...</p>;

  return (
    <div style={styles.container}>
      <h2>Admin Panel</h2>
      <p>
        <strong>Phase:</strong> {room.phase}
      </p>
      <button onClick={startGame} style={styles.startBtn}>
        Start Game
      </button>

      <h3>Players</h3>
      <ul style={styles.list}>
        {room.players.map((p: any) => (
          <li key={p.id}>
            {p.name} — {p.role} — {p.alive ? "🟢 Alive" : "🔴 Dead"}
          </li>
        ))}
      </ul>

      <h3>Log</h3>
      <ul style={styles.log}>
        {room.log.map((entry: string, i: number) => (
          <li key={i}>{entry}</li>
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
    background: "#fff8e1",
    borderRadius: 8,
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  list: { listStyle: "none", padding: 0 },
  log: { background: "#f2f2f2", padding: 10, borderRadius: 6 },
  startBtn: {
    background: "#222",
    color: "#fff",
    padding: "8px 14px",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
  },
};
