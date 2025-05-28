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
    const attemptData = { ...data, connection: "bluetooth" };

    // const userId = data.userId;

    // const device = {
    //   id: 1,
    //   mac: "mac_test",
    //   name: "Digit Pro IDA",
    //   rssi: 68,
    //   filteredRSSI: -62,
    //   distance: 0.76,
    //   device_function: "digit_pro_ida",
    //   connection: "bluetooth",
    // };

    console.log(`✅ Emitting to user ${userId}:`, { devices: [attemptData] });
    this.io.to(userId).emit("found_devices", { devices: [attemptData] });
  }
}
