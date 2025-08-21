import BaseHandler from "./base-handler.js";
import gatewayMap from "../../gateway-map.js";
import { prismaClient } from "../../../applications/database.js";

export default class ListenDigitProIDA extends BaseHandler {
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

  // get topic
  get topics() {
    return this.gateways.map(
      (gateway) => `iotgateway/${gateway.id}/bluetooth/digitpro_baby_result`
    );
  }

  // handle function
  handle(topic, message) {
    const userId = "UserTest";

    // const socketId = userMap.get(userId);

    // parsing data from mqtt
    const data = JSON.parse(message.toString());
    // const userId = data.userId;

    console.log(data);

    // send data to websocket
    this.io
      .to(userId) // socket room
      .emit("listen_digitprobaby_result", { data_digitprobaby: [data] }); // send data
  }
}
