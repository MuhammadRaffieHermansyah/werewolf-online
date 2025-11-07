"use client";
import { useEffect, useState } from "react";
import { socket } from "../../utils/socket";

export default function AdminPage() {
  const [room, setRoom] = useState<any>(null);
  const roomId = localStorage.getItem("roomId") || "";
  const name = localStorage.getItem("name") || "";

  useEffect(() => {
    if (!roomId || !name) return;
    socket.emit("createRoom", { roomId, name });
    socket.on("updateRoom", (data) => setRoom(data));
    socket.on("errorMsg", (msg) => alert(msg));
    return () => {
      socket.off("updateRoom");
      socket.off("errorMsg");
    };
  }, [roomId, name]);

  if (!room) return <p style={styles.wait}>Menunggu data room...</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>👑 Admin Panel</h2>
      <p style={styles.roomInfo}>
        Room ID: <b>{roomId}</b>
      </p>

      <ul style={styles.list}>
        {room.players.map((p: any) => (
          <li key={p.id}>
            <b>{p.name}</b> — {p.role || "No role yet"} —{" "}
            {p.alive ? "🟢 Alive" : "🔴 Dead"}
          </li>
        ))}
      </ul>

      {room.phase === "lobby" && (
        <button
          style={styles.btn}
          onClick={() => socket.emit("startGame", roomId)}
        >
          🚀 Mulai Game
        </button>
      )}

      <h3 style={styles.subTitle}>📜 Game Log</h3>
      <ul style={styles.log}>
        {room.log.map((l: string, i: number) => (
          <li key={i}>{l}</li>
        ))}
      </ul>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    color: "#fff",
    background: "linear-gradient(135deg,#000,#1a0029)",
    minHeight: "100vh",
    padding: "30px",
    fontFamily: "Poppins,sans-serif",
  },
  title: {
    fontSize: "1.8rem",
    textShadow: "0 0 20px #b517ff",
  },
  subTitle: {
    marginTop: 25,
  },
  roomInfo: {
    color: "#ccc",
    marginBottom: 15,
  },
  wait: { color: "#fff", textAlign: "center", marginTop: 100 },
  btn: {
    marginTop: 15,
    background: "#b517ff",
    border: "none",
    padding: "10px 20px",
    borderRadius: 8,
    color: "#fff",
    cursor: "pointer",
  },
  list: { listStyle: "none", padding: 0, marginBottom: 20 },
  log: {
    background: "rgba(255,255,255,0.05)",
    borderRadius: 10,
    padding: 15,
    listStyle: "none",
  },
};
