import BaseHandler from "./base-handler.js";
import { mqttClient } from "../../../applications/app.js";

export default class ScanHandler extends BaseHandler {
  event = "scan";
  get event() {
    return this.event;
  }

  handle(socket, data) {
    const { gateway_sn, data: payload } = data;

    socket.to(gateway_sn).emit(this.event, data);
    console.log(`Received scan from ${gateway_sn}:`, data);

    mqttClient.publish(payload.topic, payload.payload, (err) => {
      if (err) {
        console.log("❌ MQTT publish error:", err);
      } else {
        console.log(`✅ MQTT message published to ${payload.topic}`);
      }
    });
  }
}
