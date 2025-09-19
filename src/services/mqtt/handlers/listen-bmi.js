import BaseHandler from "./base-handler.js";
import gatewayMap from "../../gateway-map.js";
import { parseDataBMI } from "../../../applications/generator/data_bmi.js";
import { calculateHealthMetrics } from "../../../applications/generator/calculate-healt-metrics.js";
import { prismaClient } from "../../../applications/database.js";

export default class ListenBMI extends BaseHandler {
  constructor(io) {
    super(io);
  }

  get topics() {
    return Array.from(gatewayMap.keys()).map(
      (gateway) => `iotgateway/${gateway}/bluetooth/digitpro_bmi/result`,
    );
  }

  handle(topic, message) {
    try {
      const data = JSON.parse(message.toString());
      const gatewaySn = data.gateway_sn;
      const dataBmi = data.data;

      console.log(`✅ Emitting to user ${gatewaySn}:`, {
        data_bmi: [dataBmi],
      });
      this.io.to(gatewaySn).emit("listen_bmi", { data_bmi: [dataBmi] });
    } catch (error) {
      console.error("❌ Error parsing BMI data:", error.message);
    }
  }
}
