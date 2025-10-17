import BaseHandler from "./base-handler.js";
import gatewayMap from "../../gateway-map.js";
import { prismaClient } from "../../../applications/database.js";

export default class ListenDoppler extends BaseHandler {
  constructor(io) {
    super(io);
  }

  get topics() {
    return Array.from(gatewayMap.keys()).map(
      (gateway) =>
        `iotgateway/${gateway}/bluetooth/ultrasonic_pocket_doppler/realtime`,
    );
  }

  handle(topic, message) {
    try {
      const data = JSON.parse(message.toString());
      const gatewaySn = data.gateway_sn;
      const dopplerData = data.data || {};

      console.log(`✅ Emitting to gateway ${gatewaySn}:`, {
        data_doppler: dopplerData,
      });

      // Kirim event ke WebSocket client yang terhubung
      this.io
        .to(gatewaySn)
        .emit("listen_doppler", { data_doppler: dopplerData });
    } catch (error) {
      console.error("❌ Error parsing Doppler data:", error.message);
    }
  }
}
