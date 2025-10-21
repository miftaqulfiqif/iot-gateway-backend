import BaseHandler from "./base-handler.js";
import { mqttClient } from "../../../applications/app.js";

export default class GetIpAddressIotGatewayHandler extends BaseHandler {
  event = "get_ip_address_iot_gateway";
  get event() {
    return this.event;
  }

  handle(socket, data) {
    const { gateway_sn, data: payload } = data;

    // send to user
    socket.to(gateway_sn).emit(this.event, data);
    console.log(
      `Received get ip address iot gateway from ${gateway_sn}:`,
      data,
    );

    // sent to mqtt
    mqttClient.publish(payload.topic, payload.payload, (err) => {
      if (err) {
        console.log("❌ MQTT publish error:", err);
      } else {
        console.log(
          `✅ MQTT message published to ${payload.topic}: ${JSON.stringify(payload.payload)}`,
        );
      }
    });
  }
}
