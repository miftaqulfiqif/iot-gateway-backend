import BaseHandler from "./base-handler.js";
import userMap from "../../user-map.js";

export default class ListenPm9000 extends BaseHandler {
  get topic() {
    return "iotgateway/{id-unik}/tcpip/patient_monitor_9000_realtime";
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

    console.log(`✅ Emitting to user ${userId}:`, { data_pm9000: [data] });
    this.io.to(userId).emit("listen_pm9000", { data_pm9000: [data] });
  }
}
