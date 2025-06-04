import BaseHandler from "./base-handler.js";
import userMap from "../../user-map.js";

export default class ListenDigitProIDA extends BaseHandler {
  // get topic
  get topic() {
    return "iotgateway/{id-unik}/bluetooth/digitpro_baby_result";
  }

  // handle function
  handle(topic, message) {
    const userId = "UserTest";

    // const socketId = userMap.get(userId);

    // parsing data from mqtt
    const data = JSON.parse(message.toString());
    // const userId = data.userId;

    // send data to websocket
    this.io
      .to(userId) // socket room
      .emit("listen_digitprobaby", { data_digitprobaby: [data] }); // send data
  }
}
