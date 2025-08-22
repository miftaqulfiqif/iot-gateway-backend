import BaseHandler from "./base-handler.js";
import gatewayMap from "../../gateway-map.js";
import { prismaClient } from "../../../applications/database.js";

const normalizeValue = (value) => {
  if (value === 65535 || value === 9999) {
    return null;
  }
  return value;
}



export default class ListenPm9000Nibp extends BaseHandler {
  constructor(io) {
    super(io);
  }

  get topics() {
    return Array.from(gatewayMap.keys()).map(
      (gateway) => `iotgateway/${gateway}/tcpip/patient_monitor_9000_nibp`
    );
  }

  handle(topic, message) {
    const data = JSON.parse(message.toString());
    const gatewaySn = data.gateway_sn;
    const {ip, device_function, systolic, diastolic, mean} = data.data;
    const dataPm9000Nibp = {
      ip: ip,
      device_function: device_function,
      systolic: normalizeValue(systolic),
      diastolic: normalizeValue(diastolic),
      mean: normalizeValue(mean),
    };

    console.log(`✅ Emitting to user ${gatewaySn}:`, { data_pm9000_nibp: [dataPm9000Nibp] });
    this.io.to(gatewaySn).emit("listen_pm9000_nibp", { data_pm9000_nibp: [dataPm9000Nibp] });
  }
}
