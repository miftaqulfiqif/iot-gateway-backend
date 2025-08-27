import BaseHandler from "./base-handler.js";
import gatewayMap from "../../gateway-map.js";
import { prismaClient } from "../../../applications/database.js";

const normalizeValue = (value) => {
  if (value === -1000) {
    return null;
  }

  return value;
}

const normalizeValueTemp = (value) => {
  if (value === -1000) {
    return null;
  }
  const newValue = value.toFixed(1)
  return parseFloat(newValue);
}


export default class ListenDs001 extends BaseHandler {
  constructor(io) {
    super(io);
  }

  get topics() {
    return Array.from(gatewayMap.keys()).map(
      (gateway) =>
        `iotgateway/${gateway}/tcpip/diagnostic_station_001_realtime`
    );
  }

  handle(topic, message) {
    try {
      const data = JSON.parse(message.toString());
      const gatewaySn = data.gateway_sn;
      const dataDs001 = data.data;



      const payloadSend = {
        ip: dataDs001.ip,
        device_function: dataDs001.device_function,
        id_pasien: dataDs001.id_pasien,
        systolic: normalizeValue(dataDs001.systolic),
        diastolic: normalizeValue(dataDs001.diastolic),
        mean: normalizeValue(dataDs001.mean),
        pulse_rate: normalizeValue(dataDs001.pulse_rate),
        temp: normalizeValueTemp(dataDs001.temp),
        spo2: normalizeValue(dataDs001.spo2),
        pr_spo2: normalizeValue(dataDs001.pr_spo2),
        rr: normalizeValue(dataDs001.rr)
      }

      console.log(`✅ Emitting to user ${gatewaySn}:`, { data_ds001: [payloadSend] });
      this.io.to(gatewaySn).emit("listen_ds001", { data_ds001: [payloadSend] });
    } catch (error) {
      console.error("❌ Error parsing DS 001 data:", error.message);
    }
  }
}
