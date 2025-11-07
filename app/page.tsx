"use client";
import { useState, useEffect } from "react";
import { socket } from "../utils/socket";

export default function HomePage() {
  const [roomId, setRoomId] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    socket.on("errorMsg", (msg) => setError(msg));
    return () => {
      socket.off("errorMsg");
    };
  }, []);

  const createRoom = () => {
    if (!roomId || !name) return setError("Isi nama dan ID room dulu!");
    localStorage.setItem("role", "admin");
    localStorage.setItem("roomId", roomId);
    localStorage.setItem("name", name);
    window.location.href = "/admin";
  };

  const joinRoom = () => {
    if (!roomId || !name) return setError("Isi nama dan ID room dulu!");
    localStorage.setItem("role", "player");
    localStorage.setItem("roomId", roomId);
    localStorage.setItem("name", name);
    window.location.href = "/game";
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🐺 WEREWOLF ONLINE</h1>
      <div style={styles.card}>
        <input
          placeholder="Nama kamu"
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
        />
        <input
          placeholder="ID Room"
          onChange={(e) => setRoomId(e.target.value)}
          style={styles.input}
        />
        <div style={{ marginTop: 20 }}>
          <button style={styles.btnPrimary} onClick={createRoom}>
            Create Room (Admin)
          </button>
          <button style={styles.btnSecondary} onClick={joinRoom}>
            Join Room (Player)
          </button>
        </div>
        {error && <p style={styles.error}>{error}</p>}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    background: "linear-gradient(135deg, #1a0029, #000)",
    color: "#fff",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Poppins, sans-serif",
  },
  card: {
    background: "rgba(255,255,255,0.08)",
    padding: "30px 50px",
    borderRadius: "15px",
    boxShadow: "0 0 25px rgba(255,0,255,0.3)",
    textAlign: "center",
  },
  title: {
    fontSize: "2.5rem",
    marginBottom: "30px",
    textShadow: "0 0 25px #ff00ff",
  },
  input: {
    display: "block",
    margin: "10px auto",
    padding: "10px 14px",
    width: "260px",
    borderRadius: 8,
    border: "1px solid #555",
    background: "#222",
    color: "#fff",
  },
  btnPrimary: {
    background: "#b517ff",
    border: "none",
    padding: "10px 20px",
    borderRadius: 8,
    cursor: "pointer",
    color: "#fff",
    fontWeight: "bold",
    margin: "0 10px",
  },
  btnSecondary: {
    background: "#333",
    border: "1px solid #b517ff",
    padding: "10px 20px",
    borderRadius: 8,
    cursor: "pointer",
    color: "#fff",
    fontWeight: "bold",
    margin: "0 10px",
  },
  error: { color: "#ff4d4d", marginTop: 15 },
};
