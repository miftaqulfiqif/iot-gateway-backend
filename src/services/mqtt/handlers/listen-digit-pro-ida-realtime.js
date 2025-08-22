import BaseHandler from "./base-handler.js";
import gatewayMap from "../../gateway-map.js";
import { prismaClient } from "../../../applications/database.js";

export default class ListenDigitProIDARealtime extends BaseHandler {
  constructor(io) {
    super(io);
  }

  get topics() {
    return Array.from(gatewayMap.keys()).map(
      (gateway) => `iotgateway/${gateway}/bluetooth/digitpro_ida_realtime`
    );
  }

  handle(topic, message) {

    const data = JSON.parse(message.toString());
    const gatewaySn = data.gateway_sn
    const dataDigitProIDA = data.data;

    console.log(`✅ Emitting to user ${gatewaySn}:`, { data_digitproida: [dataDigitProIDA] });
    this.io
      .to(gatewaySn)
      .emit("listen_digitproida_realtime", { data_digitproida: [dataDigitProIDA] });
  }
}
