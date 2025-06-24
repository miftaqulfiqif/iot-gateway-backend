import dotenv from "dotenv";
dotenv.config(); // Wajib ada sebelum file lain yang pakai .env
console.log("✅ DATABASE_URL:", process.env.DATABASE_URL);

import { io, server, port, mqttClient } from "./applications/app.js";
import { setupSocket } from "./services/socket-services.js";
import "./services/mqtt-services.js";

setupSocket(io);

server.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
