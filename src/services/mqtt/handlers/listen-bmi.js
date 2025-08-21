import BaseHandler from "./base-handler.js";
import gatewayMap from "../../gateway-map.js";
import { parseDataBMI } from "../../../applications/generator/data_bmi.js";
import { calculateHealthMetrics } from "../../../applications/generator/calculate-healt-metrics.js";
import { prismaClient } from "../../../applications/database.js";

export default class ListenBMI extends BaseHandler {
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
      (gateway) => `iotgateway/${gateway.id}/bluetooth/digitpro_bmi_result`
    );
  }

  handle(topic, message) {
    try {
      const data = JSON.parse(message.toString());

      const socketId = userMap.get(userId);

      // const data = JSON.parse(message.toString());
      // const userId = data.userId;

      console.log(`✅ Emitting to user ${userId}:`, {
        data_bmi: [data],
      });
      this.io.to(userId).emit("listen_bmi", { data_bmi: [data] });
    } catch (error) {
      console.error("❌ Error parsing BMI data:", error.message);
    }
  }
}
