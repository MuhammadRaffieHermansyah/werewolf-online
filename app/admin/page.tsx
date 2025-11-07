"use client";
import { useEffect, useState } from "react";
import { socket } from "../../utils/socket";

export default function AdminPage() {
  const [room, setRoom] = useState<any>(null);
  const [roomId, setRoomId] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    // cek kalau window sudah tersedia (hanya di client)
    if (typeof window !== "undefined") {
      const savedRoom = localStorage.getItem("roomId") || "";
      const savedName = localStorage.getItem("name") || "";
      setRoomId(savedRoom);
      setName(savedName);

      if (savedRoom && savedName) {
        socket.emit("createRoom", { roomId: savedRoom, name: savedName });
      }
    }

    socket.on("updateRoom", (data) => setRoom(data));
    socket.on("errorMsg", (msg) => alert(msg));

    return () => {
      socket.off("updateRoom");
      socket.off("errorMsg");
    };
  }, []);

  if (!room) return <p style={styles.wait}>Menunggu data room...</p>;

  return (
    <div style={styles.container}>
      <h2>👑 Admin Panel</h2>
      <h3>
        Room ID: <span style={{ color: "#b517ff" }}>{roomId}</span>
      </h3>

      <ul style={styles.list}>
        {room.players.map((p: any) => (
          <li key={p.id}>
            <b>{p.name}</b> — {p.role || "Belum ada peran"} —{" "}
            {p.alive ? "🟢 Hidup" : "🔴 Mati"}
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

      <h3>📜 Game Log</h3>
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
    color: "#fff",
    background: "linear-gradient(135deg,#000,#1a0029)",
    minHeight: "100vh",
    padding: "30px",
    fontFamily: "Poppins,sans-serif",
  },
  wait: { color: "#fff", textAlign: "center" as const, marginTop: 100 },
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
