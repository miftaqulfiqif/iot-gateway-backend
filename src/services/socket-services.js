import SocketRouter from "./socket/socket-router.js";
import JoinRoomHandler from "./socket/handlers/join-room-handler.js";
import DisconnectHandler from "./socket/handlers/disconnect-handler.js";
import ConnectDeviceHandler from "./socket/handlers/connect-device.js";
import DeleteDeviceHandler from "./socket/handlers/delete-device.js";
import StartDigitProBaby from "./socket/handlers/start-digit-pro-baby.js";
import StopDigitProBaby from "./socket/handlers/stop-digit-pro-baby.js";
import TareDigitProBaby from "./socket/handlers/tare-digit-pro-baby.js";
import StartDoppler from "./socket/handlers/start-doppler.js";
import StopDoppler from "./socket/handlers/stop-doppler.js";
import StartBMI from "./socket/handlers/start-bmi.js";
import StartProIDA from "./socket/handlers/start-digit-pro-ida.js";
import ScanHandler from "./socket/handlers/scan-handler.js";

export function setupSocket(io) {
  const router = new SocketRouter(io);

  router.registerHandler(JoinRoomHandler);
  router.registerHandler(ScanHandler);
  router.registerHandler(DisconnectHandler);
  router.registerHandler(ConnectDeviceHandler);
  router.registerHandler(DeleteDeviceHandler);

  //DigitProIda
  router.registerHandler(StartProIDA);

  //DigitProBaby
  router.registerHandler(StartDigitProBaby);
  router.registerHandler(StopDigitProBaby);
  router.registerHandler(TareDigitProBaby);

  //Doppler
  router.registerHandler(StartDoppler);
  router.registerHandler(StopDoppler);

  //BMI
  router.registerHandler(StartBMI);

  io.on("connection", (socket) => {
    router.handleConnection(socket);
  });
}
