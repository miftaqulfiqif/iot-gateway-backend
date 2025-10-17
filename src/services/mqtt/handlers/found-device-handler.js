import BaseHandler from "./base-handler.js";
import gatewayMap from "../../gateway-map.js";

import { prismaClient } from "../../../applications/database.js";

export default class FoundDevicesHandler extends BaseHandler {
  constructor(io) {
    super(io);
  }

  get topics() {
    return Array.from(gatewayMap.keys()).map(
      (gateway) => `iotgateway/${gateway}/bluetooth/scan`,
    );
  }

  handle(topic, message) {
    try {
      const data = JSON.parse(message.toString());
      const gatewaySn = data.gateway_sn;
      const payload = data.data || data;

      const { device, mac, rssi, distance, device_function, connection } =
        payload;

      // Validation
      if (!device || !mac) {
        console.warn(
          `⚠️ Invalid device data received from ${gatewaySn}:`,
          payload,
        );
        return;
      }

      const attemptData = {
        model: device,
        mac_address: mac,
        rssi,
        distance,
        device_function,
        connection,
        gateway_id: gatewaySn,
        type: "measurement",
      };

      console.log(`✅ Emitting to user ${gatewaySn}:`, {
        devices: [attemptData],
      });
      this.io.to(gatewaySn).emit("found_devices", { devices: [attemptData] });
    } catch (err) {
      console.error("❌ Error handling MQTT message:", err.message);
    }
  }
}
