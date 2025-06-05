import BaseHandler from "./base-handler.js";
import userMap from "../../user-map.js";

export default class FoundDevicesHandler extends BaseHandler {
  get topic() {
    return "iotgateway/{id-unik}/bluetooth/scan_result";
  }

  handle(topic, message) {
    const userId = "UserTest";

    const socketId = userMap.get(userId);

    const data = JSON.parse(message.toString());
    const attemptData = {
      ...data,
      type: "measurement",
      hospital_id: userId,
    };

    // const userId = data.userId;

    console.log(`✅ Emitting to user ${userId}:`, { devices: [attemptData] });
    this.io.to(userId).emit("found_devices", { devices: [attemptData] });
  }
}
