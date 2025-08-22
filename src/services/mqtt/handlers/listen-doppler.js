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
        `iotgateway/${gateway}/bluetooth/ultrasonic_pocket_doppler_realtime`
    );
  }

  handle(topic, message) {
    try {
      const data = JSON.parse(message.toString());
      const gatewaySn = data.gateway_sn;
      const dataDoppler = data.data;

      console.log(`✅ Emitting to user ${gatewaySn}:`, {
        data_doppler: [dataDoppler],
      });

      this.io.to(gatewaySn).emit("listen_doppler", { data_doppler: [dataDoppler] });
    } catch (error) {
      console.error("❌ Error parsing Doppler data:", error.message);
    }
  }
}
