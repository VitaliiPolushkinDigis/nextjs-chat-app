import { createContext } from "react";
import { io } from "socket.io-client";

export const socket = io("process.env.NEXT_PUBLIC_URL", {
  reconnectionAttempts: 3,
  withCredentials: true,
});
export const SocketContext = createContext(socket);
