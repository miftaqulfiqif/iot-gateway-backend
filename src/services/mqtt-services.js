import { io, mqttClient } from "../applications/app.js";
import MqttRouter from "./mqtt/mqtt-router.js";
import FoundDevicesHandler from "./mqtt/handlers/found-device-handler.js";
import ListenDigitProIDAResult from "./mqtt/handlers/listen-digit-pro-ida-result.js";
import ListenDigitProIDARealtime from "./mqtt/handlers/listen-digit-pro-ida-realtime.js";
import ListenDigitProBabyRealtime from "./mqtt/handlers/listen-digit-pro-baby-realtime.js";
import ListenDigitProBabyResult from "./mqtt/handlers/listen-digit-pro-baby-result.js";
import ListenBMI from "./mqtt/handlers/listen-bmi.js";
import ListenDoppler from "./mqtt/handlers/listen-doppler.js";
import ListenPm9000 from "./mqtt/handlers/listen-pm9000.js";
import ListenPm9000Nibp from "./mqtt/handlers/listen-pm9000_nibp.js";
import ListenDs001 from "./mqtt/handlers/listen-ds001.js";

const mqttRouter = new MqttRouter(mqttClient, io);
mqttRouter.registerHandler(FoundDevicesHandler);
mqttRouter.registerHandler(ListenDigitProIDAResult);
mqttRouter.registerHandler(ListenDigitProIDARealtime);
mqttRouter.registerHandler(ListenDigitProBabyRealtime);
mqttRouter.registerHandler(ListenDigitProBabyResult);
mqttRouter.registerHandler(ListenBMI);
mqttRouter.registerHandler(ListenDoppler);
mqttRouter.registerHandler(ListenPm9000);
mqttRouter.registerHandler(ListenPm9000Nibp);
mqttRouter.registerHandler(ListenDs001);

mqttRouter.init();
