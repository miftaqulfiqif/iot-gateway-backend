import BaseHandler from "./base-handler.js";
import { mqttClient } from "../../../applications/app.js";

export default class ScanHandler extends BaseHandler {
  get event() {
    return "scan";
  }

  handle(socket, data) {
    const { userId, data: payload } = data;

    socket.to(userId).emit("scan", data);
    console.log(`Received scan from ${userId}:`, payload);

    mqttClient.publish(payload.topic, payload.payload, (err) => {
      if (err) {
        console.log("❌ MQTT publish error:", err);
      } else {
        console.log(`✅ MQTT message published to ${payload.topic}`);
      }
    });
  }
}
