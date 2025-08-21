import { prismaClient } from "../applications/database.js";
import gatewayMap from "./gateway-map.js";

export async function loadGatewaysFromDB() {
  const gateways = await prismaClient.iotGateway.findMany({
    select: { id: true },
  });

  gateways.forEach((gateway) => {
    gatewayMap.set(gateway.id);
  });

  console.log(`✅ Loaded ${gatewayMap.size} gateways from DB`);
}
