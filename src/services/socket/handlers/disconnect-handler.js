// /services/socket/handlers/DisconnectHandler.js
import BaseHandler from "./base-handler.js";

export default class DisconnectHandler extends BaseHandler {
  get event() {
    return "disconnect";
  }

  handle(socket) {
    console.log(`❌ User disconnected`);
  }
}
