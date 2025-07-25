import BaseHandler from "./base-handler.js";
import { mqttClient } from "../../../applications/app.js";
import { prismaClient } from "../../../applications/database.js";

export default class ConnectDeviceTcpIpHandler extends BaseHandler {
  event = "connect_device_tcpip";
  get event() {
    return this.event;
  }

  async handle(socket, data) {
    const { user_id, hospital_id, display_name, data: payload } = data;
    const { ip, device, device_function, connection, type, topic } =
      payload.payload;

    // send to user
    socket.to(user_id).emit(this.event, data);
    console.log(`Received connect_device from ${user_id}:`, payload);

    // save device to database
    try {
      await prismaClient.deviceConnected.upsert({
        where: { id: ip },
        update: {
          device: device,
          device_function: device_function,
          connection: connection,
          name: display_name ?? device,
          type: type,
          hospital_id: hospital_id,
        },
        create: {
          id: ip,
          name: display_name ?? device,
          device: device,
          device_function: device_function,
          connection: connection,
          type: type,
          hospital_id: hospital_id,
        },
      });

      // payload to mqtt
      const payloadSend = {
        ip,
        device_function,
      };

      // sent to mqtt
      mqttClient.publish(payload.topic, JSON.stringify(payloadSend), (err) => {
        if (err) {
          console.log("❌ MQTT publish error:", err);
        } else {
          console.log(
            `✅ MQTT message published to ${payload.topic}: ${JSON.stringify(
              payloadSend
            )}`
          );
        }
      });
    } catch (error) {
      throw error;
    }
  }
}
