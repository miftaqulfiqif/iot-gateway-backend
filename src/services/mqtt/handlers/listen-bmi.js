import BaseHandler from "./base-handler.js";
import userMap from "../../user-map.js";
import { parseDataBMI } from "../../../applications/generator/data_bmi.js";
import { calculateHealthMetrics } from "../../../applications/generator/calculate-healt-metrics.js";

const gateways = [
  {
    id: "{id-unik}",
    name: "Gateway Test",
  },
  {
    id: "test_1",
    name: "Gateway 1",
  },
  {
    id: "test_2",
    name: "Gateway 2",
  },
  {
    id: "test_3",
    name: "Gateway 3",
  },
  {
    id: "test_4",
    name: "Gateway 4",
  },
];

export default class ListenBMI extends BaseHandler {
  get topics() {
    return gateways.map(
      (gateway) => `iotgateway/${gateway.id}/bluetooth/digitpro_bmi_result`
    );
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
