import { io, server, port, mqttClient } from "./applications/app.js";
import { setupSocket } from "./services/socket-services.js";
import "./services/mqtt-services.js";

setupSocket(io);

server.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
