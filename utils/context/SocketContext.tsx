import { createContext } from "react";
import { io } from "socket.io-client";

export const socket = io(
  /* process.env.REACT_APP_WEBSOCKET_URL! */ /* "http://localhost:3001" */ "https://chat-nestjs-92c46b4f7e43.herokuapp.com",
  {
    reconnectionAttempts: 3,
    withCredentials: true,
  }
);
export const SocketContext = createContext(socket);
