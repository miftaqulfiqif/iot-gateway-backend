import BaseHandler from "./base-handler.js";
import gatewayMap from "../../gateway-map.js";

export default class ListenMtrBaby002 extends BaseHandler {
  constructor(io) {
    super(io);
  }

  get topics() {
    return Array.from(gatewayMap.keys()).map(
      (gateway) => `iotgateway/${gateway}/bluetooth/mtr_baby002/realtime`,
    );
  }

  handle(topic, message) {
    try {
      const data = JSON.parse(message.toString());
      const gatewaySn = data.gateway_sn;
      const dataMtrBaby002 = data.data;

      console.log(`✅ Emitting to user ${gatewaySn}:`, {
        data_mtr_baby002: dataMtrBaby002,
      });

      this.io.to(gatewaySn).emit("listen_mtr_baby002", {
        data_mtr_baby002: dataMtrBaby002,
      });
    } catch (error) {
      console.error("❌ Error parsing MTR BABY-002 data:", error.message);
    }
  }
}
