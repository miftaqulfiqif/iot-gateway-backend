import BaseHandler from "./base-handler.js";
import gatewayMap from "../../gateway-map.js";

import { prismaClient } from "../../../applications/database.js";

export default class FoundDevicesHandler extends BaseHandler {
  constructor(io) {
    super(io);
    this.gateways = Array.from(gatewayMap.keys());
  }
  async init() {
    this.gateways = await prismaClient.iotGateway.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }
  get topics() {
    return this.gateways.map(
      (gateway) => `iotgateway/${gateway.id}/bluetooth/scan_result`
    );
  }

  handle(topic, message) {
    const data = JSON.parse(message.toString());
    const { device, mac, rssi, distance, device_function, connection } =
      data.data;
    const gatewaySn = data.gateway_sn;
    const gateway = gatewayMap.get(gatewaySn);
    // if (!gateway) {
    //   console.warn(`⚠️ Gateway ${gatewaySn} tidak ditemukan di gatewayMap`);
    //   return;
    // }

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

    console.log(`✅ LIST OF GATEWAYS:`, this.gateways);

    console.log(`✅ Emitting to user ${gatewaySn}:`, {
      devices: [attemptData],
    });
    this.io.to(gatewaySn).emit("found_devices", { devices: [attemptData] });
  }
}
