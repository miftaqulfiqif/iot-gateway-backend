import dotenv from "dotenv";

dotenv.config();
console.log("✅ DATABASE_URL:", process.env.DATABASE_URL);

import { io, server, port, mqttClient } from "./applications/app.js";
import { setupSocket } from "./services/socket-services.js";
import {loadGatewaysFromDB} from "./services/gateway-utils.js";
// import "./services/mqtt-services.js";


setupSocket(io);

async function main() {
  await loadGatewaysFromDB();

  await import("./services/mqtt-services.js");

  server.listen(port, "0.0.0.0", () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
  });
}

main();

