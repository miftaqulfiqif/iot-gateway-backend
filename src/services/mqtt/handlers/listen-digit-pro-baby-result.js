import BaseHandler from "./base-handler.js";
import gatewayMap from "../../gateway-map.js";
import { prismaClient } from "../../../applications/database.js";

export default class ListenDigitProIDA extends BaseHandler {
  constructor(io) {
    super(io);
  }

  // get topic
  get topics() {
    return Array.from(gatewayMap.keys()).map(
      (gateway) => `iotgateway/${gateway}/bluetooth/digitpro_baby_result`
    );
  }

  // handle function
  handle(topic, message) {
    // parsing data from mqtt
    const data = JSON.parse(message.toString());
    const gatewaySn = data.gateway_sn;
    const dataDigitProBaby = data.data;

    console.log(`✅ Emitting to user ${gatewaySn}:`, {
      data_digitprobaby: [dataDigitProBaby],
    });
    // send data to websocket
    this.io
      .to(gatewaySn) // socket room
      .emit("listen_digitprobaby_result", { data_digitprobaby: [dataDigitProBaby] }); // send data
  }
}
