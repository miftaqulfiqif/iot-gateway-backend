import SocketRouter from "./socket/socket-router.js";
import ScanHandler from "./socket/handlers/scan-handler.js";
import JoinRoomHandler from "./socket/handlers/join-room-handler.js";
import DisconnectHandler from "./socket/handlers/disconnect-handler.js";

export function setupSocket(io) {
  const router = new SocketRouter(io);

  router.registerHandler(ScanHandler);
  router.registerHandler(JoinRoomHandler);
  router.registerHandler(DisconnectHandler);

  io.on("connection", (socket) => {
    router.handleConnection(socket);
  });
}
