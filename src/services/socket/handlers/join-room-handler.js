import BaseHandler from "./base-handler.js";

export default class JoinRoomHandler extends BaseHandler {
  get event() {
    return "join";
  }

  handle(socket, userId) {
    socket.join(userId);
    console.log(`✅ User ${userId} joined room`);
  }
}
