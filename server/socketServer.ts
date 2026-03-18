import type { Server as HttpServer } from "node:http";
import { createServer } from "node:http";
import { Server } from "socket.io";
import {
  addChatMessage,
  advancePhase,
  approvePolicyRequirement,
  contributePolicy,
  createRoom,
  getAllRooms,
  getRoom,
  joinRoom,
  leaveRoom,
  selectPolicy,
  deselectPolicy,
  setRoomEventListeners,
  startGame,
  submitReflection,
  toggleReady,
  useSpecialAbility,
} from "./roomManager";
import { ReflectionAnswers } from "../lib/gameTypes";

export function attachSocketServer(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      credentials: true,
    },
  });

  setRoomEventListeners(
    (event, room, payload) => {
      if (event === "room_created") {
        return;
      }
      io.to(room.roomCode).emit(event, payload ?? room);
      if (event !== "room_updated") {
        io.to(room.roomCode).emit("room_updated", room);
      }
    },
    (roomCode) => {
      io.to(roomCode).emit("room_updated", null);
    },
  );

  io.on("connection", (socket) => {
    socket.emit("timer_sync", { connected: true });

    socket.on("create_room", ({ name }: { name: string }) => {
      try {
        const playerId = createId();
        const room = createRoom({
          id: playerId,
          socketId: socket.id,
          name: (name || "Player").trim(),
        });
        socket.join(room.roomCode);
        socket.data.playerId = playerId;
        socket.data.roomCode = room.roomCode;
        socket.emit("room_created", { roomCode: room.roomCode, playerId });
        socket.emit("room_updated", room);
      } catch (error) {
        socket.emit("error_message", getErrorMessage(error));
      }
    });

    socket.on("join_room", ({ roomCode, name }: { roomCode: string; name: string }) => {
      try {
        const playerId = createId();
        const room = joinRoom(roomCode.toUpperCase(), {
          id: playerId,
          socketId: socket.id,
          name: (name || "Player").trim(),
        });
        socket.join(room.roomCode);
        socket.data.playerId = playerId;
        socket.data.roomCode = room.roomCode;
        socket.emit("room_joined", { roomCode: room.roomCode, playerId });
        io.to(room.roomCode).emit("room_updated", room);
      } catch (error) {
        socket.emit("error_message", getErrorMessage(error));
      }
    });

    socket.on("leave_room", () => {
      const { roomCode, playerId } = socket.data as { roomCode?: string; playerId?: string };
      if (!roomCode || !playerId) return;
      socket.leave(roomCode);
      leaveRoom(roomCode, playerId);
    });

    socket.on("start_game", ({ roomCode, playerId }: { roomCode: string; playerId: string }) => {
      try {
        const room = getRoom(roomCode);
        if (!room || room.hostPlayerId !== playerId) {
          throw new Error("Only the host can start the mission.");
        }
        const nextRoom = startGame(roomCode);
        nextRoom.players.forEach((player) => {
          const privateSocket = io.sockets.sockets.get(player.socketId);
          if (privateSocket) {
            privateSocket.emit("role_assigned", {
              playerId: player.id,
              roleId: player.roleId,
            });
          }
        });
      } catch (error) {
        socket.emit("error_message", getErrorMessage(error));
      }
    });

    socket.on("advance_phase", ({ roomCode, playerId }: { roomCode: string; playerId: string }) => {
      try {
        const room = getRoom(roomCode);
        if (!room || room.hostPlayerId !== playerId) {
          throw new Error("Only the host can advance the mission.");
        }
        advancePhase(roomCode);
      } catch (error) {
        socket.emit("error_message", getErrorMessage(error));
      }
    });

    socket.on("toggle_ready", ({ roomCode, playerId }: { roomCode: string; playerId: string }) => {
      try {
        toggleReady(roomCode, playerId);
      } catch (error) {
        socket.emit("error_message", getErrorMessage(error));
      }
    });

    socket.on("select_policy", ({ roomCode, policyId }: { roomCode: string; policyId: string }) => {
      try {
        selectPolicy(roomCode, policyId);
      } catch (error) {
        socket.emit("error_message", getErrorMessage(error));
      }
    });

    socket.on(
      "approve_requirement",
      ({ roomCode, policyId, playerId }: { roomCode: string; policyId: string; playerId: string }) => {
        try {
          approvePolicyRequirement(roomCode, policyId, playerId);
        } catch (error) {
          socket.emit("error_message", getErrorMessage(error));
        }
      },
    );

    socket.on(
      "contribute_policy",
      ({
        roomCode,
        policyId,
        playerId,
        delta,
      }: {
        roomCode: string;
        policyId: string;
        playerId: string;
        delta: number;
      }) => {
        try {
          contributePolicy(roomCode, policyId, playerId, delta);
        } catch (error) {
          socket.emit("error_message", getErrorMessage(error));
        }
      },
    );

    socket.on("use_special_ability", ({ roomCode, playerId }: { roomCode: string; playerId: string }) => {
      try {
        useSpecialAbility(roomCode, playerId);
      } catch (error) {
        socket.emit("error_message", getErrorMessage(error));
      }
    });

    socket.on("deselect_policy", ({ roomCode, policyId }: { roomCode: string; policyId: string }) => {
      try {
        deselectPolicy(roomCode, policyId);
      } catch (error) {
        socket.emit("error_message", getErrorMessage(error));
      }
    });

    socket.on(
      "submit_reflection",
      ({
        roomCode,
        playerId,
        answers,
      }: {
        roomCode: string;
        playerId: string;
        answers: ReflectionAnswers;
      }) => {
        try {
          submitReflection(roomCode, playerId, answers);
        } catch (error) {
          socket.emit("error_message", getErrorMessage(error));
        }
      },
    );

    socket.on(
      "send_chat_message",
      ({
        roomCode,
        playerId,
        content,
      }: {
        roomCode: string;
        playerId: string;
        content: string;
      }) => {
        try {
          addChatMessage(roomCode, playerId, content);
        } catch (error) {
          socket.emit("error_message", getErrorMessage(error));
        }
      },
    );

    socket.on("disconnect", () => {
      const { roomCode, playerId } = socket.data as { roomCode?: string; playerId?: string };
      if (!roomCode || !playerId) return;
      leaveRoom(roomCode, playerId);
    });
  });

  setInterval(() => {
    for (const room of getAllRooms()) {
      io.to(room.roomCode).emit("timer_sync", {
        roomCode: room.roomCode,
        phase: room.phase,
        phaseStartedAt: room.phaseStartedAt,
        countdownSeconds: room.countdownSeconds,
      });
    }
  }, 1000);

  return io;
}

function startStandaloneSocketServer() {
  const httpServer = createServer();
  attachSocketServer(httpServer);

  const port = Number(process.env.SOCKET_PORT ?? 3001);
  httpServer.listen(port, () => {
    console.log(`Socket server listening on http://localhost:${port}`);
  });
}

if (process.argv[1]?.includes("socketServer")) {
  startStandaloneSocketServer();
}

function createId() {
  return Math.random().toString(36).slice(2, 10);
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unexpected server error.";
}
