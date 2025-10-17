import BaseHandler from "./base-handler.js";
import gatewayMap from "../../gateway-map.js";

export default class ListenPulseOximeterFox1 extends BaseHandler {
  constructor(io) {
    super(io);
  }

  get topics() {
    return Array.from(gatewayMap.keys()).map(
      (gateway) => `iotgateway/${gateway}/bluetooth/pulse_oximeter/realtime`,
    );
  }

  handle(topic, message) {
    // parsing data from mqtt
    const data = JSON.parse(message.toString());
    const gatewaySn = data.gateway_sn;
    const dataPulseOximeterFox1 = data.data;

    console.log(`✅ Emitting to user ${gatewaySn}:`, {
      data_pulse_oximeter_fox_1: dataPulseOximeterFox1,
    });

    this.io.to(gatewaySn).emit("listen_pulse_oximeter_fox_1", {
      data_pulse_oximeter_fox_1: dataPulseOximeterFox1,
    });
  }
}
