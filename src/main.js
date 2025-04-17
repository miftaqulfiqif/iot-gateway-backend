import { io, server, port, mqttClient } from "./applications/app.js";
import { setupSocket } from "./services/socket-services.js";
import "./services/mqtt-services.js";

setupSocket(io);

server.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
