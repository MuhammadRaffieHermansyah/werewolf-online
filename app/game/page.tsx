"use client";
import { useEffect, useState } from "react";
import { socket, Room, Player } from "../../utils/socket";

export default function GamePage() {
  const [room, setRoom] = useState<Room | null>(null);
  const [me, setMe] = useState<Player | null>(null);
  const [roomId, setRoomId] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedRoom = localStorage.getItem("roomId") || "";
      const savedName = localStorage.getItem("name") || "";
      setRoomId(savedRoom);
      setName(savedName);

      if (savedRoom && savedName) {
        socket.emit("joinRoom", { roomId: savedRoom, name: savedName });
      }
    }

    socket.on("updateRoom", (data: Room) => {
      setRoom(data);
      const currentPlayer = data.players.find(p => p.id === socket.id) || null;
      setMe(currentPlayer);
    });

    socket.on("errorMsg", (msg) => alert(msg));

    return () => {
      socket.off("updateRoom");
      socket.off("errorMsg");
    };
  }, []);

  if (!room || !me)
    return <p style={styles.wait}>Menunggu room dimulai...</p>;

  const handleVote = (target: string) => socket.emit("vote", { roomId, target });
  const handleNightAction = (target: string) =>
    socket.emit("nightAction", { roomId, target });

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🌙 WEREWOLF GAME</h2>
        <h3 style={styles.roomInfo}>
          Room ID: <span style={{ color: "#b517ff" }}>{roomId}</span>
        </h3>

        <p>
          <strong>Phase:</strong>{" "}
          <span style={{ color: "#b517ff" }}>{room.phase}</span>
        </p>

        <p>
          <strong>Kamu:</strong> {me.name} —{" "}
          <span style={{ color: "#ff77ff" }}>{me.role}</span>{" "}
          {me.alive ? "🟢" : "🔴"}
        </p>

        <h3 style={styles.subTitle}>🧍 Pemain</h3>
        <ul style={styles.list}>
          {room.players.map((p) => (
            <li key={p.id} style={styles.listItem}>
              {p.name} — {p.alive ? "🟢 Hidup" : "🔴 Mati"}
            </li>
          ))}
        </ul>

        {room.phase === "day" && me.alive && (
          <>
            <h3>🗳️ Pilih siapa yang kamu curigai!</h3>
            {room.players
              .filter((p) => p.alive && p.id !== socket.id)
              .map((p) => (
                <button
                  key={p.id}
                  style={styles.btnPrimary}
                  onClick={() => handleVote(p.name)}
                >
                  Vote {p.name}
                </button>
              ))}
          </>
        )}

        {room.phase === "night" && me.alive && (
          <>
            <h3>🌌 Malam tiba — lakukan aksi sesuai peranmu!</h3>
            {room.players
              .filter((p) => p.alive && p.id !== socket.id)
              .map((p) => (
                <button
                  key={p.id}
                  style={styles.btnSecondary}
                  onClick={() => handleNightAction(p.name)}
                >
                  Target {p.name}
                </button>
              ))}
          </>
        )}

        <h3 style={styles.subTitle}>📜 Log</h3>
        <ul style={styles.log}>
          {room.log.map((l, i) => (
            <li key={i}>{l}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    background: "linear-gradient(135deg, #0a0014, #1a0029)",
    color: "#fff",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Poppins, sans-serif",
  },
  card: {
    background: "rgba(255,255,255,0.05)",
    padding: "30px 40px",
    borderRadius: "15px",
    boxShadow: "0 0 20px rgba(181,23,255,0.3)",
    textAlign: "center",
    width: "90%",
    maxWidth: "600px",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "10px",
    textShadow: "0 0 20px #ff00ff",
  },
  roomInfo: {
    fontWeight: "normal",
    marginBottom: 25,
    color: "#ccc",
  },
  wait: {
    color: "#fff",
    textAlign: "center",
    marginTop: 100,
    fontFamily: "Poppins, sans-serif",
  },
  list: {
    listStyle: "none",
    padding: 0,
    marginBottom: 20,
  },
  listItem: {
    background: "rgba(255,255,255,0.05)",
    borderRadius: 8,
    padding: "8px",
    marginBottom: 5,
  },
  log: {
    background: "rgba(255,255,255,0.05)",
    borderRadius: 10,
    padding: 15,
    listStyle: "none",
    textAlign: "left",
    maxWidth: 400,
    margin: "20px auto",
  },
  btnPrimary: {
    background: "#b517ff",
    border: "none",
    padding: "10px 20px",
    borderRadius: 8,
    cursor: "pointer",
    color: "#fff",
    fontWeight: "bold",
    margin: "5px",
    transition: "0.2s",
  },
  btnSecondary: {
    background: "#333",
    border: "1px solid #b517ff",
    padding: "10px 20px",
    borderRadius: 8,
    cursor: "pointer",
    color: "#fff",
    fontWeight: "bold",
    margin: "5px",
    transition: "0.2s",
  },
  subTitle: {
    marginTop: 25,
    textShadow: "0 0 10px #b517ff",
  },
};
