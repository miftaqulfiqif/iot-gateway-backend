import BaseHandler from "./base-handler.js";
import { mqttClient } from "../../../applications/app.js";

export default class TareDigitProBaby extends BaseHandler {
  event = "tare_digit_pro_baby";
  get event() {
    return this.event;
  }

  handle(socket, data) {
    const { gateway_sn, data: payload } = data;

    socket.to(gateway_sn).emit(this.event, data);
    console.log(`Received scan from ${gateway_sn}:`, payload);

    mqttClient.publish(payload.topic, payload.payload, (err) => {
      if (err) {
        console.log("❌ MQTT publish error:", err);
      } else {
        console.log(`✅ MQTT message published to ${payload.topic}`);
      }
    });
  }
}
