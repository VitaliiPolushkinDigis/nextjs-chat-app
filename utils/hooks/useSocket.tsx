import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export function useSocket() {
  const [socket, setSocket] = useState<any>();

  const controller = new AbortController();

  useEffect(() => {
    (async function initSocket() {
      const inst = io(
        /*  "http://localhost:3001" */ "https://chat-nestjs-92c46b4f7e43.herokuapp.com",
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
