"use client";

import { io, Socket } from "socket.io-client";

let socketSingleton: Socket | null = null;

export function getSocket() {
  if (!socketSingleton) {
    const fallbackUrl =
      typeof window !== "undefined"
        ? window.location.origin
        : "http://localhost:3000";

    socketSingleton = io(process.env.NEXT_PUBLIC_SOCKET_URL ?? fallbackUrl, {
      transports: ["websocket"],
      autoConnect: true,
    });
  }

  return socketSingleton;
}
