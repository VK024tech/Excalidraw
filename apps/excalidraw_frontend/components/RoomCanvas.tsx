"use client";

import { WS_URL } from "@/config";
import { initDraw } from "@/draw";
import { useEffect, useRef, useState } from "react";
import { Canvas } from "./Canvas";

export function RoomCanvas({ roomId }: { roomId: string }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(
      `${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiMzE1YWMwYi00MjUxLTQ1ZWUtODE5NS0xZmVkMjU5NjU5MTkiLCJpYXQiOjE3NTAyMjczMjh9.uBWVnPgSW4T5HE6FjYoAaTnCLSGWRzWkzwYqBwZ00k8`
    );

    ws.onopen = () => {
      setSocket(ws);
      const data = JSON.stringify({
        type: "join_room",
        roomId,
      });
      console.log(data);
      ws.send(data);
    };
  }, []);

  if (!socket) {
    return <div>Connecting to Server....</div>;
  }

  return (
    <div>
      <Canvas roomId={roomId} socket={socket}/>

      {/* <div className="absolute bottom-0 right-0">
        <button className="bg-white text-black">Rectangle</button>
        <button className="bg-white text-black">Circle</button>
      </div> */}
    </div>
  );
}
