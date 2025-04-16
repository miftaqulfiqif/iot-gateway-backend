export default class MqttRouter {
  constructor(mqttClient, io) {
    this.mqttClient = mqttClient;
    this.io = io;
    this.handlers = new Map();
  }

  registerHandler(HandlerClass) {
    const handlerInstance = new HandlerClass(this.io);
    const topic = handlerInstance.topic;

    this.handlers.set(topic, handlerInstance);

    this.mqttClient.subscribe(topic, (err) => {
      if (err) {
        console.log(`❌ Error subscribing to ${topic}:`, err);
      } else {
        console.log(`✅ Subscribed to topic: ${topic}`);
      }
    });
  }

  init() {
    this.mqttClient.on("message", (topic, message) => {
      const handler = this.handlers.get(topic);
      if (handler) {
        handler.handle(topic, message);
      } else {
        console.log(`⚠️ No handler for topic ${topic}`);
      }
    });
  }
}
