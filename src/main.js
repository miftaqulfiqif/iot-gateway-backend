import { io, server, port } from "./applications/app.js";
import SocketHandler from "./applications/socket-handler.js";

const socketHandler = new SocketHandler();

io.on("connection", (socket) => {
  socketHandler.handleConnection(socket);
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
