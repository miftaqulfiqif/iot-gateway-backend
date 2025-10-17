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
import ListenDs001Pleth from "./mqtt/handlers/listen-ds001-pleth.js";
import ListenGetIpAddressIotGateway from "./mqtt/handlers/listen-get-ip-address-iot-gateway.js";
import ListenMft01 from "./mqtt/handlers/listen-mft01.js";
import ListenTensiOne from "./mqtt/handlers/listen-tensione.js";
import ListenPulseOximeterFox1 from "./mqtt/handlers/listen-pulse-oximeter-fox-1.js";
import ListenPtbDigi from "./mqtt/handlers/listen-ptb-digi.js";

const mqttRouter = new MqttRouter(mqttClient, io);

await mqttRouter.registerHandlers([
  FoundDevicesHandler,
  ListenDigitProIDAResult,
  ListenDigitProIDARealtime,
  ListenDigitProBabyRealtime,
  ListenDigitProBabyResult,
  ListenBMI,
  ListenDoppler,
  ListenPm9000,
  ListenPm9000Nibp,
  ListenDs001,
  ListenDs001Pleth,
  ListenGetIpAddressIotGateway,
  ListenMft01,
  ListenTensiOne,
  ListenPulseOximeterFox1,
  ListenPtbDigi,
]);

mqttRouter.init();
