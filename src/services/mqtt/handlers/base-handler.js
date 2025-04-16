// /services/mqtt/handlers/BaseHandler.js
export default class BaseHandler {
  constructor(io) {
    this.io = io;
  }

  // Harus diimplementasikan anaknya
  get topic() {
    throw new Error("Handler must define topic getter");
  }

  handle(topic, message) {
    throw new Error("Handler must implement handle()");
  }
}
