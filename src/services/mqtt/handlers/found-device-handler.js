import BaseHandler from "./base-handler.js";
import userMap from "../../user-map.js";

export default class FoundDevicesHandler extends BaseHandler {
  get topic() {
    return "IoTGateway/{ID-Unik}/Bluetooth/ScanRst";
  }

  handle(topic, message) {
    const userId = "UserTest1";

    const socketId = userMap.get(userId);

    const data = JSON.parse(message.toString());
    const attemptData = {
      ...data,
      type: "measurement",
      label: "device",
      user_id: userId,
    };

    // const userId = data.userId;

    console.log(`✅ Emitting to user ${userId}:`, { devices: [attemptData] });
    this.io.to(userId).emit("found_devices", { devices: [attemptData] });
  }
}
