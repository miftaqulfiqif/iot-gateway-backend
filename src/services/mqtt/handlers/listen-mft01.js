import BaseHandler from "./base-handler.js";
import gatewayMap from "../../gateway-map.js";

export default class ListenMft01 extends BaseHandler {
  constructor(io) {
    super(io);
  }

  get topics() {
    return Array.from(gatewayMap.keys()).map(
      (gateway) => `iotgateway/${gateway}/bluetooth/mft01/result`,
    );
  }

  handle(topic, message) {
    try {
      const data = JSON.parse(message.toString());
      const gatewaySn = data.gateway_sn;
      const dataMft01 = data.data;

      console.log(`✅ Emitting to user ${gatewaySn}:`, {
        data_mft01: dataMft01,
      });

      this.io.to(gatewaySn).emit("listen_mft01", {
        data_mft01: dataMft01,
      });
    } catch (error) {
      console.error("❌ Error parsing MFT-01 data:", error.message);
    }
  }
}
