"use client";
import { useEffect, useState } from "react";
import { socket } from "../../utils/socket";

export default function GamePage() {
  const [room, setRoom] = useState<any>(null);
  const [me, setMe] = useState<any>(null);
  const roomId = localStorage.getItem("roomId") || "";
  const name = localStorage.getItem("name") || "";

  useEffect(() => {
    if (!roomId || !name) return;
    socket.emit("joinRoom", { roomId, name });

    socket.on("updateRoom", (data) => {
      setRoom(data);
      setMe(data.players.find((p: any) => p.id === socket.id));
    });

    socket.on("errorMsg", (msg) => alert(msg));
    return () => {
      socket.off("updateRoom");
      socket.off("errorMsg");
    };
  }, [roomId, name]);

  if (!room || !me) return <p style={styles.wait}>Menunggu room dimulai...</p>;

  const handleVote = (target: string) => {
    socket.emit("vote", { roomId, target });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🌙 Werewolf Game</h2>
      <p>
        <strong>Phase:</strong> {room.phase}
      </p>

      <p>
        <strong>Kamu:</strong> {me.name} —{" "}
        <span style={{ color: "#b517ff" }}>{me.role}</span>
      </p>

      <h3>Pemain</h3>
      <ul style={styles.list}>
        {room.players.map((p: any) => (
          <li key={p.id}>
            {p.name} — {p.alive ? "🟢 Alive" : "🔴 Dead"}
          </li>
        ))}
      </ul>

      {room.phase === "day" && me.alive && (
        <>
          <h3>🗳️ Pilih siapa yang kamu curigai!</h3>
          {room.players
            .filter((p: any) => p.alive && p.id !== socket.id)
            .map((p: any) => (
              <button
                key={p.id}
                style={styles.voteBtn}
                onClick={() => handleVote(p.name)}
              >
                Vote {p.name}
              </button>
            ))}
        </>
      )}

      {room.phase === "night" && <p>🌌 Malam tiba... tunggu hasilnya.</p>}
      {room.phase === "ended" && <p>🎉 Game selesai! {room.log.at(-1)}</p>}

      <h3 style={styles.subTitle}>📜 Log</h3>
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
    background: "linear-gradient(135deg,#0a0014,#1a0029)",
    minHeight: "100vh",
    padding: 30,
    fontFamily: "Poppins,sans-serif",
  },
  title: {
    textShadow: "0 0 20px #b517ff",
  },
  wait: { color: "#fff", textAlign: "center", marginTop: 100 },
  list: { listStyle: "none", padding: 0 },
  log: {
    background: "rgba(255,255,255,0.05)",
    borderRadius: 10,
    padding: 15,
    listStyle: "none",
  },
  voteBtn: {
    margin: "5px",
    padding: "8px 16px",
    background: "#b517ff",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
  subTitle: { marginTop: 25 },
};
