"use client";
import { useEffect, useState } from "react";
import { socket } from "../../utils/socket";

export default function GamePage() {
  const [room, setRoom] = useState<any>(null);
  const [me, setMe] = useState<any>(null);
  const [roomId, setRoomId] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole !== "player") {
      alert("Kamu bukan player!");
      window.location.href = "/";
      return;
    }

    const storedRoomId = localStorage.getItem("roomId");
    const storedName = localStorage.getItem("name");

    if (!storedRoomId || !storedName) {
      alert("Data tidak lengkap. Kembali ke halaman awal.");
      window.location.href = "/";
      return;
    }

    setRoomId(storedRoomId);
    setName(storedName);

    // 🔵 Join ke room
    socket.emit("joinRoom", { roomId: storedRoomId, name: storedName });

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
      <h2>Game Room</h2>
      <p>
        <strong>Nama:</strong> {me.name} <br />
        <strong>Role:</strong> {me.role ?? "Belum dibagikan"} <br />
        <strong>Status:</strong> {me.alive ? "Alive" : "Dead"}
      </p>

      <h3>Daftar Pemain</h3>
      <ul style={styles.list}>
        {room.players.map((p: any) => (
          <li key={p.id}>
            {p.name} — {p.alive ? "Alive" : "Dead"}
          </li>
        ))}
      </ul>

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
};
