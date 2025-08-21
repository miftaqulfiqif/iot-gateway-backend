import BaseHandler from "./base-handler.js";
import gatewayMap from "../../gateway-map.js";
import { prismaClient } from "../../../applications/database.js";

export default class ListenDoppler extends BaseHandler {
  constructor(io) {
    super(io);
    this.gateways = [];
  }

  async init() {
    this.gateways = await prismaClient.iotGateway.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }
  get topics() {
    return this.gateways.map(
      (gateway) =>
        `iotgateway/${gateway.id}/bluetooth/ultrasonic_pocket_doppler_realtime`
    );
  }

  handle(topic, message) {
    const userId = "UserTest";

    // const socketId = userMap.get(userId);

    const data = JSON.parse(message.toString());
    // const userId = data.userId;

    console.log(`✅ Emitting to user ${userId}:`, {
      data_doppler: [data],
    });

    this.io.to(userId).emit("listen_doppler", { data_doppler: [data] });
  }
}
