import { io, server, port } from "./applications/app.js";
import { setupSocket } from "./services/socket-services.js";

setupSocket(io);

server.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
