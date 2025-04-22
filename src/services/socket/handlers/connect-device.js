import BaseHandler from "./base-handler.js";
import { mqttClient } from "../../../applications/app.js";
import { prismaClient } from "../../../applications/database.js";

export default class ConnectDeviceHandler extends BaseHandler {
  event = "connect_device";
  get event() {
    return this.event;
  }

  async handle(socket, data) {
    const { user_id, data: payload } = data;

    socket.to(user_id).emit(this.event, data);
    console.log(
      `Received connect_device from ${user_id}:`,
      payload.payload.mac
    );
    try {
      const deviceFound = await prismaClient.device.findUnique({
        where: {
          mac: payload.payload.mac,
        },
      });
      if (!deviceFound) {
        await prismaClient.device.create({
          data: {
            mac: payload.payload.mac,
            name: payload.payload.name,
          },
        });
      }

      console.log("Device saved");
    } catch (error) {
      throw error;
    }

    mqttClient.publish(payload.topic, payload.payload.mac, (err) => {
      if (err) {
        console.log("❌ MQTT publish error:", err);
      } else {
        console.log(`✅ MQTT message published to ${payload.topic}`);
      }
    });
  }
}
