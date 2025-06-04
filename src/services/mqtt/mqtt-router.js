export default class MqttRouter {
  constructor(mqttClient, io) {
    this.mqttClient = mqttClient;
    this.io = io;
    this.handlers = new Map();
  }

  // register handler topic mqtt
  registerHandler(HandlerClass) {
    const handlerInstance = new HandlerClass(this.io); // create handler instance
    const topic = handlerInstance.topic; // get topic

    this.handlers.set(topic, handlerInstance); // add handler to map

    // subscribe topic
    this.mqttClient.subscribe(topic, (err) => {
      if (err) {
        console.log(`❌ Error subscribing to ${topic}:`, err);
      } else {
        console.log(`✅ Subscribed to topic: ${topic}`);
      }
    });
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
