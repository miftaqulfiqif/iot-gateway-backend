export default class BaseHandler {
  constructor(io) {
    this.io = io;
  }

  get topics() {
    throw new Error("Handler must define topics getter (array of strings)");
  }

  handle(topic, message) {
    throw new Error("Handler must implement handle()");
  }
}
