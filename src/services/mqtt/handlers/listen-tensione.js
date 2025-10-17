import BaseHandler from "./base-handler.js";
import gatewayMap from "../../gateway-map.js";

export default class ListenTensiOne extends BaseHandler {
  constructor(io) {
    super(io);
  }

  // get topic
  get topics() {
    return Array.from(gatewayMap.keys()).map(
      (gateway) => `iotgateway/${gateway}/bluetooth/tensione/result`,
    );
  }

  handle(topic, message) {
    // parsing data from mqtt
    const data = JSON.parse(message.toString());
    const gatewaySn = data.gateway_sn;
    const dataTensione = data.data;

    console.log(`✅ Emitting to user ${gatewaySn}:`, {
      data_tensione: dataTensione,
    });

    this.io.to(gatewaySn).emit("listen_tensione", {
      data_tensione: dataTensione,
    });
  }
}
