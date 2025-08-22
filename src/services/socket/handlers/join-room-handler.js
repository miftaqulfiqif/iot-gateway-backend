import BaseHandler from "./base-handler.js";
import gatewayMap from "../../gateway-map.js";

export default class JoinRoomHandler extends BaseHandler {
  event = "join";

  get event() {
    return this.event;
  }

  handle(socket, gatewaySn) {
    console.log(`✅ User ${gatewaySn} joined room, socket: ${socket.id}`);

    if (gatewayMap.has(gatewaySn)) {
      console.warn(`⚠️ Gateway ${gatewaySn} sudah terdaftar di gatewayMap`);
    }

    socket.join(gatewaySn);
  }
}

export function printGateways() {
  if (gatewayMap.size === 0) {
    console.log("⚠️  Tidak ada gateway yang terdaftar.");
    return;
  }

  const gateways = Array.from(gatewayMap.keys());

  console.log("✅ LIST OF GATEWAYS : ", gateways);
}
