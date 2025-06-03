import BaseHandler from "./base-handler.js";
import { mqttClient } from "../../../applications/app.js";
import { prismaClient } from "../../../applications/database.js";

export default class ConnectDeviceHandler extends BaseHandler {
  event = "connect_device";
  get event() {
    return this.event;
  }

  async handle(socket, data) {
    const { user_id, hospital_id, label, data: payload } = data;
    const {
      mac,
      device: name,
      device_function: code,
      connection,
      type,
      name: displayName,
      topic,
    } = payload.payload;

    // send to user
    socket.to(user_id).emit(this.event, data);
    console.log(`Received connect_device from ${user_id}:`, payload);

    // save device to database
    try {
      await prismaClient.deviceConnected.upsert({
        where: { mac },
        update: {
          name,
          display_name: displayName,
          code,
          connection,
          label,
          type,
        },
        create: {
          mac,
          name,
          display_name: displayName,
          code,
          connection,
          label,
          hospital_id,
          type,
        },
      });

      console.log("Device saved or updated");
    } catch (error) {
      throw error;
    }

    // payload to mqtt
    const payloadSend = {
      mac,
      device_function: code,
    };

    // sent to mqtt
    mqttClient.publish(payload.topic, JSON.stringify(payloadSend), (err) => {
      if (err) {
        console.log("❌ MQTT publish error:", err);
      } else {
        console.log(
          `✅ MQTT message published to ${topic}: ${JSON.stringify(
            payloadSend
          )}`
        );
      }
    });
  }
}
