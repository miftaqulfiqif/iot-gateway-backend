import BaseHandler from "./base-handler.js";
import gatewayMap from "../../gateway-map.js";
import { prismaClient } from "../../../applications/database.js";


const normalizeValue = (value) => {
  if (value === 65535 || value === 9999) {
    return null;
  }
  return value;
}

export default class ListenPm9000 extends BaseHandler {
  constructor(io) {
    super(io);
  }

  get topics() {
    return Array.from(gatewayMap.keys()).map(
      (gateway) =>
        `iotgateway/${gateway}/tcpip/patient_monitor_9000_realtime`
    );
  }

  handle(topic, message) {
    const data = JSON.parse(message.toString());
    const gatewaySn = data.gateway_sn;
    const {ip, device_function, ecg_bpm, ecg_bpm_spo2, spo2, resp, temp1, temp2, delta_temp} = data.data;

    const dataPm9000 = {
      ip: ip,
      device_function: device_function,
      ecg_bpm: normalizeValue(ecg_bpm),
      ecg_bpm_spo2: normalizeValue(ecg_bpm_spo2),
      spo2: normalizeValue(spo2),
      resp: normalizeValue(resp),
      temp1: normalizeValue(temp1),
      temp2: normalizeValue(temp2),
      delta_temp: normalizeValue(delta_temp),
    };

    console.log(`✅ Emitting to user ${gatewaySn}:`, { data_pm9000: [dataPm9000] });
    this.io.to(gatewaySn).emit("listen_pm9000", { data_pm9000: [dataPm9000] });
  }
}


