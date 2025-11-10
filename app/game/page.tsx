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

  if (!room || !me) return <p>Menunggu room dimulai...</p>;

  const handleVote = (target: string) => socket.emit("vote", { roomId, target });
  const handleNightAction = (target: string) => socket.emit("nightAction", { roomId, target });

  return (
    <div>
      <h2>🌙 WEREWOLF GAME</h2>
      <p>Phase: {room.phase}</p>
      <p>Kamu: {me.name} — {me.role}</p>

      {room.phase === "day" && me.alive &&
        room.players.filter(p => p.alive && p.id !== socket.id).map(p =>
          <button key={p.id} onClick={() => handleVote(p.name)}>Vote {p.name}</button>
        )
      }

      {room.phase === "night" && me.alive &&
        room.players.filter(p => p.alive && p.id !== socket.id).map(p =>
          <button key={p.id} onClick={() => handleNightAction(p.name)}>Target {p.name}</button>
        )
      }

      <h3>Log:</h3>
      <ul>
        {room.log.map((l, i) => <li key={i}>{l}</li>)}
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
