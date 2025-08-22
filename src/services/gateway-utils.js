import { prismaClient } from "../applications/database.js";
import gatewayMap from "./gateway-map.js";

export async function loadGatewaysFromDB() {
  const gateways = await prismaClient.iotGateway.findMany({
    select: {
      id: true,
      name: true,
      description: true,
    },
  });

  gateways.forEach((gateway) => {
    gatewayMap.set(gateway.id, {
      name: gateway.name,
      description: gateway.description,
    });
  });

  console.log(`✅ Loaded ${gatewayMap.size} gateways from DB`);
}
