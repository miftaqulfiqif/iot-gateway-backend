import BaseHandler from "./base-handler.js";
import gatewayMap from "../../gateway-map.js";
export default class ListenDs001Pleth extends BaseHandler {
  constructor(io) {
    super(io);
    this.gateways = [];
  }

  get topics() {
    return this.gateways.map(
      (gateway) =>
        `iotgateway/${gateway.id}/tcpip/diagnostic_station_001_plethiotgateway/${gateway.id}/tcpip/diagnostic_station_001_command`
    );
  }

  handle(topic, message) {
    const userId = "UserTest";

    // const socketId = userMap.get(userId);
    // if (!socketId) {
    //   console.warn(`⚠️ No socket found for userId: ${userId}`);
    //   return;
    // }
    // this.io.to(socketId).emit("listen_digitproida", { data_digitproida: [data] });

    const data = JSON.parse(message.toString());
    // const userId = data.userId;

    console.log(`✅ Emitting to user ${userId}:`, { data_ds001_pleth: [data] });
    this.io.to(userId).emit("listen_ds001_pleth", { data_ds001_pleth: [data] });
  }
}
