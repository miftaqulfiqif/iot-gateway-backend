// /services/socket/handlers/DisconnectHandler.js
import BaseHandler from "./base-handler.js";
import userMap from "../../user-map.js";

export default class DisconnectHandler extends BaseHandler {
  event = "disconnect";
  get event() {
    return this.event;
  }

  handle(socket) {
    for (const [userId, sockId] of userMap.entries()) {
      if (sockId === socket.id) {
        console.log(` Disconnected user: ${userId}`);
        userMap.delete(userId);
        break;
      }
    }
  }
}
