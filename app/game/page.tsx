"use client";
import { useEffect, useState } from "react";
import { socket } from "../../utils/socket";

export default function GamePage() {
  const [room, setRoom] = useState<any>(null);
  const [me, setMe] = useState<any>(null);
  const [roomId, setRoomId] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    // Hindari error SSR: hanya ambil localStorage di client
    if (typeof window !== "undefined") {
      const savedRoom = localStorage.getItem("roomId") || "";
      const savedName = localStorage.getItem("name") || "";
      setRoomId(savedRoom);
      setName(savedName);

      if (savedRoom && savedName) {
        socket.emit("joinRoom", { roomId: savedRoom, name: savedName });
      }
    }

    socket.on("updateRoom", (data) => {
      setRoom(data);
      setMe(data.players.find((p: any) => p.id === socket.id));
    });

    socket.on("errorMsg", (msg) => alert(msg));

    return () => {
      socket.off("updateRoom");
      socket.off("errorMsg");
    };
  }, []);

  if (!room || !me) return <p style={styles.wait}>Menunggu room dimulai...</p>;

  const handleVote = (target: string) => {
    socket.emit("vote", { roomId, target });
  };

  return (
    <div style={styles.container}>
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
        <span style={{ color: "#ff77ff" }}>{me.role}</span>
      </p>

      <h3>Pemain</h3>
      <ul style={styles.list}>
        {room.players.map((p: any) => (
          <li key={p.id} style={{ marginBottom: 6 }}>
            {p.name} — {p.alive ? "🟢 Hidup" : "🔴 Mati"}
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
    fontFamily: "Poppins, sans-serif",
    textAlign: "center",
  },
  title: {
    textShadow: "0 0 20px #b517ff",
    marginBottom: 10,
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
  log: {
    background: "rgba(255,255,255,0.05)",
    borderRadius: 10,
    padding: 15,
    listStyle: "none",
    textAlign: "left",
    maxWidth: 400,
    margin: "20px auto",
  },
  voteBtn: {
    margin: "5px",
    padding: "10px 20px",
    background: "#b517ff",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: "bold",
    transition: "0.2s",
  },
  subTitle: {
    marginTop: 25,
    textShadow: "0 0 10px #b517ff",
  },
};
