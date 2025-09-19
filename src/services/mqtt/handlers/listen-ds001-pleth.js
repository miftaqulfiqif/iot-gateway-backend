import BaseHandler from "./base-handler.js";
import gatewayMap from "../../gateway-map.js";
export default class ListenDs001Pleth extends BaseHandler {
  constructor(io) {
    super(io);
  }

  get topics() {
    return Array.from(gatewayMap.keys()).map(
      (gateway) =>
        // `iotgateway/${gateway}/tcpip/diagnostic_station_001_plethiotgateway/${gateway.id}/tcpip/diagnostic_station_001_command`
        `iotgateway/${gateway}/tcpip/diagnostic_station_001/pleth`,
    );
  }

  handle(topic, message) {
    const data = JSON.parse(message.toString());
    const gatewaySn = data.gateway_sn;
    const dataDs001Pleth = data.data;

    console.log(`✅ Emitting to user ${gatewaySn}:`, {
      data_ds001_pleth: [dataDs001Pleth],
    });
    this.io
      .to(gatewaySn)
      .emit("listen_ds001_pleth", { data_ds001_pleth: [dataDs001Pleth] });
  }
}
