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
    socket.emit("createRoom", { roomId, name });
    window.location.href = "/admin";
  };

  const joinRoom = () => {
    socket.emit("joinRoom", { roomId, name });
    window.location.href = "/game";
  };

  return (
    <div style={{ textAlign: "center", padding: 40 }}>
      <h1>🐺 Werewolf Online</h1>
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
      <div>
        <button style={styles.btn} onClick={createRoom}>
          Create Room (Admin)
        </button>
        <button style={styles.btn} onClick={joinRoom}>
          Join Room (Player)
        </button>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

const styles = {
  input: {
    display: "block",
    margin: "10px auto",
    padding: "8px 12px",
    width: "250px",
    borderRadius: 6,
    border: "1px solid #ccc",
  },
  btn: {
    margin: "10px",
    padding: "8px 16px",
    borderRadius: 6,
    background: "#222",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
};
