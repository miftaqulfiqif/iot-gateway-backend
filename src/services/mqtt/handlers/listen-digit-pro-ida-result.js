import BaseHandler from "./base-handler.js";
import userMap from "../../user-map.js";

export default class ListenDigitProIDAResult extends BaseHandler {
  get topic() {
    return "iotgateway/{id-unik}/bluetooth/digitpro_ida_result";
  }

  handle(topic, message) {
    const userId = "UserTest";

    // const socketId = userMap.get(userId);
    // if (!socketId) {
    //   console.warn(`⚠️ No socket found for userId: ${userId}`);
    //   return;
    // }
    // this.io.to(socketId).emit("listen_digitproida", { data_digitproida: [data] });

    const data = JSON.parse(message.toString());
    // const userId = data.userId;

    console.log(`✅ Emitting to user ${userId}:`, { data_digitproida: [data] });
    this.io
      .to(userId)
      .emit("listen_digitproida_result", { data_digitproida: [data] });
  }
}
