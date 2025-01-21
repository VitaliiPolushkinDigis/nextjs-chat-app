import { createContext } from "react";
import { io } from "socket.io-client";

export const socket = io(`${process.env.NEXT_PUBLIC_URL}`, {
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
export const SocketContext = createContext(socket);
