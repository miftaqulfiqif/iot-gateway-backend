import BaseHandler from "./base-handler.js";

export default class FoundDevicesHandler extends BaseHandler {
  get topic() {
    return "ble/devices";
  }

  handle(topic, message) {
    const data = JSON.parse(message.toString());
    const userId = data.userId;

    if (userId) {
      this.io.to(userId).emit("found_devices", data);
      console.log(`MQTT [${topic}] → WebSocket user ${userId}:`, data);
    } else {
      this.io.to(userId).emit("found_devices", data);
      console.log(`MQTT [${topic}] missing userId`, data);
    }
  }
}
