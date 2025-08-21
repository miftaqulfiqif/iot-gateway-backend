import BaseHandler from "./base-handler.js";
import gatewayMap from "../../gateway-map.js";
import { prismaClient } from "../../../applications/database.js";

export default class ListenDigitProIDAResult extends BaseHandler {
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
      (gateway) => `iotgateway/${gateway.id}/bluetooth/digitpro_ida_result`
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

    console.log(`✅ Emitting to user ${userId}:`, { data_digitproida: [data] });
    this.io
      .to(userId)
      .emit("listen_digitproida_result", { data_digitproida: [data] });
  }
}
