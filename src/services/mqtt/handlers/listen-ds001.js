import BaseHandler from "./base-handler.js";
import gatewayMap from "../../gateway-map.js";
import { prismaClient } from "../../../applications/database.js";

export default class ListenDs001 extends BaseHandler {
  constructor(io) {
    super(io);
  }

  get topics() {
    return Array.from(gatewayMap.keys()).map(
      (gateway) =>
        `iotgateway/${gateway}/tcpip/diagnostic_station_001_realtime`
    );
  }

  handle(topic, message) {
    try {
      const data = JSON.parse(message.toString());
      const gatewaySn = data.gateway_sn;
      const dataDs001 = data.data;

      console.log(`✅ Emitting to user ${gatewaySn}:`, { data_ds001: [dataDs001] });
      this.io.to(gatewaySn).emit("listen_ds001", { data_ds001: [dataDs001] });
    } catch (error) {
      console.error("❌ Error parsing DS 001 data:", error.message);
    }
  }
}
