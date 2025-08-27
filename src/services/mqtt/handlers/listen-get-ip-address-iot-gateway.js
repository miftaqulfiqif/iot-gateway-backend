import BaseHandler from "./base-handler.js";
import gatewayMap from "../../gateway-map.js";
import { prismaClient } from "../../../applications/database.js";

export default class ListenGetIpAddressIotGateway extends BaseHandler {
    constructor(io) {
        super(io);
    }

    // get topic
    get topics() {
        return Array.from(gatewayMap.keys()).map(
            (gateway) => `iotgateway/${gateway}/ip`
        );
    }

    // handle function
    async handle(topic, message) {
        try {
            // parsing data from mqtt
            const data = JSON.parse(message.toString());
            const gatewaySn = data.gateway_sn;
            const dataIpAddressIotGateway = data.data;

            console.log(`✅ Emitting to user ${gatewaySn}:`, {
                ip_address_iot_gateway: dataIpAddressIotGateway,
            });

            await prismaClient.iotGateway.update({
                where: {
                    id: gatewaySn,
                },
                data: {
                    ip_address: dataIpAddressIotGateway.ip
                },
            })
        } catch (error) {
            console.error("❌ Error updating gateway:", error.message);
        }
    }
}
