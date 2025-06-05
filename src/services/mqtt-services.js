import { io, mqttClient } from "../applications/app.js";
import MqttRouter from "./mqtt/mqtt-router.js";
import FoundDevicesHandler from "./mqtt/handlers/found-device-handler.js";
import ListenDigitProIDA from "./mqtt/handlers/listen-digit-pro-ida.js";
import ListenDigitProBabyRealtime from "./mqtt/handlers/listen-digit-pro-baby-realtime.js";
import ListenDigitProBabyResult from "./mqtt/handlers/listen-digit-pro-baby-result.js";
import ListenBMI from "./mqtt/handlers/listen-bmi.js";
import ListenDoppler from "./mqtt/handlers/listen-doppler.js";

const mqttRouter = new MqttRouter(mqttClient, io);
mqttRouter.registerHandler(FoundDevicesHandler);
mqttRouter.registerHandler(ListenDigitProIDA);
mqttRouter.registerHandler(ListenDigitProBabyRealtime);
mqttRouter.registerHandler(ListenDigitProBabyResult);
mqttRouter.registerHandler(ListenBMI);
mqttRouter.registerHandler(ListenDoppler);

mqttRouter.init();
