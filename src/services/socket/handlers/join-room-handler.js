import BaseHandler from "./base-handler.js";
import userMap from "../../user-map.js";

export default class JoinRoomHandler extends BaseHandler {
  event = "join";
  get event() {
    return this.event;
  }

  handle(socket, userId) {
    console.log(`✅ User ${userId} joined room, socket: ${socket.id}`);
    userMap.set(userId, socket.id);

    socket.join(userId);
  }
}
