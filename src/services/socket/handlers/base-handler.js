export default class BaseHandler {
  constructor(io) {
    this.io = io;
  }

  get event() {
    throw new Error("Socket handler must implement 'event'");
  }

  handle(socket, data) {
    throw new Error("Socket handler must implement 'handle()'");
  }
}
