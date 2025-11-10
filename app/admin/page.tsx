"use client";
import { useEffect, useState } from "react";
import { socket, Room } from "../../utils/socket";

export default function AdminPage() {
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const roomId = localStorage.getItem("roomId");
    const name = localStorage.getItem("name");
    if (!roomId || !name) return;

    socket.emit("joinRoom", { roomId, name });
    socket.on("updateRoom", (data) => {
      setRoom(data);
      setLoading(false);
    });

    return () => {
      socket.off("updateRoom");
    };
  }, []);

  const startGame = () => {
    const roomId = localStorage.getItem("roomId");
    if (roomId) socket.emit("startGame", { roomId });
  };

  const nextPhase = () => {
    const roomId = localStorage.getItem("roomId");
    if (roomId) socket.emit("nextPhase", { roomId });
  };

  if (loading || !room) return <p style={{ color: "#fff", textAlign: "center" }}>Menunggu pemain...</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🧙 Admin Panel</h2>
      <p>Room ID: <b>{localStorage.getItem("roomId")}</b></p>

      <div>
        <button style={styles.btnPrimary} onClick={startGame}>🎮 Start Game</button>
        <button style={styles.btnSecondary} onClick={nextPhase}>⏭️ Next Phase</button>
      </div>

      <h3 style={styles.subTitle}>👥 Daftar Pemain</h3>
      <ul style={styles.playerList}>
        {room.players.map((p) => (
          <li key={p.id} style={styles.playerItem}>
            {p.name} — {p.role || "Belum dibagikan"} {p.alive ? "🟢" : "🔴"}
          </li>
        ))}
      </ul>

      <h3 style={styles.subTitle}>📜 Log</h3>
      <ul style={styles.log}>
        {room.log.map((l, i) => <li key={i}>{l}</li>)}
      </ul>
    </div>
  );
}

const styles = {
  container: {
    color: "#fff",
    background: "linear-gradient(135deg,#0a0014,#1a0029)",
    minHeight: "100vh",
    padding: 30,
    fontFamily: "Poppins,sans-serif",
  },
  title: { fontSize: "1.8rem", textShadow: "0 0 20px #b517ff" },
  subTitle: { marginTop: 25 },
  playerList: { listStyle: "none", padding: 0 },
  playerItem: {
    background: "rgba(255,255,255,0.05)",
    margin: "5px 0",
    padding: "8px 12px",
    borderRadius: 8,
  },
  btnPrimary: {
    background: "#b517ff",
    border: "none",
    padding: "10px 20px",
    borderRadius: 8,
    cursor: "pointer",
    color: "#fff",
    margin: "10px",
  },
  btnSecondary: {
    background: "#333",
    border: "1px solid #b517ff",
    padding: "10px 20px",
    borderRadius: 8,
    cursor: "pointer",
    color: "#fff",
  },
  log: {
    background: "rgba(255,255,255,0.05)",
    borderRadius: 10,
    padding: 15,
    listStyle: "none",
  },
};
