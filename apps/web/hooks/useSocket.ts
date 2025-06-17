import { useEffect, useState } from "react";
import { WS_URL } from "../config";

export function useSocket() {
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<WebSocket>();

  useEffect(() => {
    const ws = new WebSocket(
      `${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0MzFkNjIyNC1hN2QxLTQ5MGYtYjcyYS01NDJhYjY2NjBhZmQiLCJpYXQiOjE3NDk3MDkyOTF9.lRH8gHsPAahNvDsNdeSOr3XGkntCSr7Haop9OOL3SRA`
    );
    ws.onopen = () => {
      setLoading(false);
      setSocket(ws);
    };
  }, []);

  return {
    socket,
    loading,
  };
}
