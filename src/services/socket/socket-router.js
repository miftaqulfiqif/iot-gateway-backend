export default class SocketRouter {
  constructor(io) {
    this.io = io;
    this.handlers = new Map();
  }

  registerHandler(HandlerClass) {
    const instance = new HandlerClass(this.io);
    this.handlers.set(instance.event, instance);
  }

  handleConnection(socket) {
    console.log("🟢 User connected via WebSocket");

    for (const [event, handler] of this.handlers.entries()) {
      socket.on(event, (data) => handler.handle(socket, data));
    }
  }
}
