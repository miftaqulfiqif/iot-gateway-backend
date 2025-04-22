import { io, mqttClient } from "../applications/app.js";
import MqttRouter from "./mqtt/mqtt-router.js";
import FoundDevicesHandler from "./mqtt/handlers/found-device-handler.js";
import ListenDigitProIDA from "./mqtt/handlers/listen-digit-pro-ida.js";

const mqttRouter = new MqttRouter(mqttClient, io);
mqttRouter.registerHandler(FoundDevicesHandler);
mqttRouter.registerHandler(ListenDigitProIDA);

mqttRouter.init();
