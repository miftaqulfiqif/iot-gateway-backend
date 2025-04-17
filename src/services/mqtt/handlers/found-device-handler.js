import BaseHandler from "./base-handler.js";
import userMap from "../../user-map.js";

export default class FoundDevicesHandler extends BaseHandler {
  get topic() {
    return "ble/devices";
  }

  handle(topic, message) {
    const userId = "UserTest";

    const socketId = userMap.get(userId);

    const data = JSON.parse(message.toString());
    // const userId = data.userId;

    console.log(`✅ Emitting to user ${userId}:`, { devices: [data] });
    this.io.to(userId).emit("found_devices", { devices: [data] });
  }
}
