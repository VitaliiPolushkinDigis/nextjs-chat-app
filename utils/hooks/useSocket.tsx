import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export function useSocket() {
  const [socket, setSocket] = useState<any>();

  const controller = new AbortController();

  useEffect(() => {
    (async function initSocket() {
      const inst = io(
        /* "http://localhost:3001" */ "https://test-nest-api-production.up.railway.app",
        {
          reconnectionAttempts: 3,
          withCredentials: true,
        }
      );
      setSocket(inst);
    })();

    return () => {
      controller.abort();
    };
  }, []);

  return { socket };
}
