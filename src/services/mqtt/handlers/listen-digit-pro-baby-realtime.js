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
      (gateway) => `iotgateway/${gateway}/bluetooth/digitpro_baby/realtime`,
    );
  }

  // handle function
  handle(topic, message) {
    try {
      const data = JSON.parse(message.toString());
      const gatewaySn = data.gateway_sn;
      const dataDigitProBaby = data.data;

      console.log(`✅ Emitting to user ${gatewaySn}:`, {
        data_digit_pro_baby_realtime: [dataDigitProBaby],
      });

      // send data to websocket
      this.io
        .to(gatewaySn) // socket room
        .emit("listen_digitprobaby_realtime", {
          data_digitprobaby_realtime: [dataDigitProBaby],
        }); // send data
    } catch (error) {
      console.error("❌ Error parsing BMI data:", error.message);
    }
  }
}
