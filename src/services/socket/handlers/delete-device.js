import BaseHandler from "./base-handler.js";
import { mqttClient } from "../../../applications/app.js";
import { prismaClient } from "../../../applications/database.js";
import { logger } from "../../../applications/logging.js";

export default class DeleteDeviceHandler extends BaseHandler {
  event = "delete_device";

  get event() {
    return this.event;
  }

  async handle(socket, data) {
    const { user_id, data: payload } = data;

    socket.to(user_id).emit(this.event, data);
    console.log(`Received delete_device from ${user_id}:`, payload);

    try {
      const { mac } = payload.payload;
      console.log(mac);
      if (!mac) {
        console.log("Device not found");
      } else {
        logger.info(`Device deleted: ${mac}`);
        await prismaClient.device.delete({
          where: { mac: mac },
        });
        console.log("Device deleted");
      }
    } catch (error) {
      logger.error(error);
      throw error;
    }

    mqttClient.publish(payload.topic, payload.payload, (err) => {
      if (err) {
        console.log("❌ MQTT publish error:", err);
      } else {
        console.log(`✅ MQTT message published to ${payload.topic}`);
      }
    });
  }
}
