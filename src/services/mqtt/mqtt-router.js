export default class MqttRouter {
  constructor(mqttClient, io) {
    this.mqttClient = mqttClient;
    this.io = io;
    this.handlers = new Map();
  }

  // register handler topic mqtt
  async registerHandlers(handlerClasses = []) {
    for (const HandlerClass of handlerClasses) {
      const handlerInstance = new HandlerClass(this.io);

      // kalau ada method init(), tunggu dulu
      if (typeof handlerInstance.init === "function") {
        await handlerInstance.init();
      }

      const topics = handlerInstance.topics;

      topics.forEach((topic) => {
        this.handlers.set(topic, handlerInstance);

        this.mqttClient.subscribe(topic, (err) => {
          if (err) {
            console.log(`❌ Error subscribing to ${topic}:`, err);
          } else {
            console.log(`✅ Subscribed to topic: ${topic}`);
          }
        });
      });
    }
  }

  // main function
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
