import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export function useSocket() {
  const [socket, setSocket] = useState<any>();

  const controller = new AbortController();

  useEffect(() => {
    (async function initSocket() {
      const inst = io(process.env.NEXT_PUBLIC_URL, {
        reconnectionAttempts: 3,
        withCredentials: true,
        transports: ["websocket", "polling", "flashsocket"], // Specify WebSocket as transport
        extraHeaders: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        auth: {
          token: `Bearer ${localStorage.getItem("access_token") || ""}`,
        },
      });
      setSocket(inst);
    })();

    return () => {
      controller.abort();
    };
  }, []);

  return { socket };
}
