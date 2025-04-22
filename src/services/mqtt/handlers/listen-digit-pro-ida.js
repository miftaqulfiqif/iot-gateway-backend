import BaseHandler from "./base-handler.js";
import userMap from "../../user-map.js";

export default class ListenDigitProIDA extends BaseHandler {
  get topic() {
    return "ble/weights";
  }

  handle(topic, message) {
    const userId = "UserTest";

    const socketId = userMap.get(userId);

    const data = JSON.parse(message.toString());
    // const userId = data.userId;

    console.log(`✅ Emitting to user ${userId}:`, { data_digitproida: [data] });
    this.io.to(userId).emit("listen_digitproida", { data_digitproida: [data] });
  }
}
