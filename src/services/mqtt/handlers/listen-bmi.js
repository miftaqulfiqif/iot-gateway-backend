import BaseHandler from "./base-handler.js";
import userMap from "../../user-map.js";
import { parseDataBMI } from "../../../applications/generator/data_bmi.js";
import { calculateHealthMetrics } from "../../../applications/generator/calculate-healt-metrics.js";

export default class ListenBMI extends BaseHandler {
  get topic() {
    return "iotgateway/{id-unik}/bluetooth/digitpro_bmi_result";
  }

  handle(topic, message) {
    const userId = "UserTest";

    const socketId = userMap.get(userId);

    // const data = JSON.parse(message.toString());
    // const userId = data.userId;

    const data = JSON.parse(message.toString());

    console.log(`✅ Emitting to user ${userId}:`, {
      data_bmi: [data],
    });
    this.io.to(userId).emit("listen_bmi", { data_bmi: [data] });
  }
}
