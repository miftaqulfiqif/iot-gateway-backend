import { io, mqttClient } from "../applications/app.js";
import MqttRouter from "./mqtt/mqtt-router.js";
import FoundDevicesHandler from "./mqtt/handlers/found-device-handler.js";

const mqttRouter = new MqttRouter(mqttClient, io);
mqttRouter.registerHandler(FoundDevicesHandler);

mqttRouter.init();
