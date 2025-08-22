import BaseHandler from "./base-handler.js";
import gatewayMap from "../../gateway-map.js";

import { prismaClient } from "../../../applications/database.js";

export default class FoundDevicesHandler extends BaseHandler {
  constructor(io) {
    super(io);
  }

  get topics() {
    return Array.from(gatewayMap.keys()).map(
      (gateway) => `iotgateway/${gateway}/bluetooth/scan_result`
    );
  }

  handle(topic, message) {
    const data = JSON.parse(message.toString());
    const { device, mac, rssi, distance, device_function, connection } =
      data.data;
    const gatewaySn = data.gateway_sn;


    const attemptData = {
      model: device,
      mac_address: mac,
      rssi: rssi,
      distance: distance,
      device_function: device_function,
      connection: connection,
      gateway_id: gatewaySn,
      type: "measurement",
    };


    console.log(`✅ Emitting to user ${gatewaySn}:`, {
      devices: [attemptData],
    });
    // this.io.to("gateway1").emit("found_devices", { devices: [attemptData] });
    this.io.to(gatewaySn).emit("found_devices", { devices: [attemptData] });
  }
}