import BaseHandler from "./base-handler.js";
import userMap from "../../user-map.js";

export default class ListenDoppler extends BaseHandler {
  get topic() {
    return "ble/doppler_data";
  }

  handle(topic, message) {
    const userId = "UserTest";

    const socketId = userMap.get(userId);

    const data = JSON.parse(message.toString());
    // const userId = data.userId;

    console.log(`✅ Emitting to user ${userId}:`, {
      data_doppler: [data],
    });

    this.io.to(userId).emit("listen_doppler", { data_doppler: [data] });
  }
}
