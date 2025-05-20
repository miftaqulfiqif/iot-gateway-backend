import BaseHandler from "./base-handler.js";
import userMap from "../../user-map.js";
import { parseDataBMI } from "../../../generated/data_bmi.js";

export default class ListenBMI extends BaseHandler {
  get topic() {
    return "ble/bmi_weights";
  }

  handle(topic, message) {
    const userId = "UserTest";

    const socketId = userMap.get(userId);

    // const data = JSON.parse(message.toString());
    // const userId = data.userId;

    const raw = message.toString();
    const data = parseDataBMI(raw);

    console.log(`✅ Emitting to user ${userId}:`, {
      data_bmi: [data],
    });
    this.io.to(userId).emit("listen_bmi", { data_bmi: [data] });
  }
}
