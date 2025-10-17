import BaseHandler from "./base-handler.js";
import gatewayMap from "../../gateway-map.js";

export default class Listener extends BaseHandler {
  constructor(io) {
    super(io);
  }

  get topics() {
    return Array.from(gatewayMap.keys()).map(
      (gateway) => `iotgateway/${gateway}/bluetooth/height_gauge/realtime`,
    );
  }

  handle(topic, message) {
    const data = JSON.parse(message.toString());
    const gatewaySn = data.gateway_sn;
    const dataPtbDigi = data.data;

    console.log(`✅ Emitting to user ${gatewaySn}:`, {
      data_ptb_digi: dataPtbDigi,
    });

    this.io.to(gatewaySn).emit("listen_ptb_digi", {
      data_ptb_digi: dataPtbDigi,
    });
  }
}
