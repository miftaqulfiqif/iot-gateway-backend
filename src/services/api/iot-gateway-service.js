import { prismaClient } from "../../applications/database.js";
import { ResponseError } from "../../errors/response-error.js";
import { mqttClient } from "../../applications/app.js";

export const createNewIotGatewayDevice = async (hospitalId, body) => {
  try {
    const { id, name, ip_address, room_id, description } = body;

    const gatewayFound = await prismaClient.iotGateway.findUnique({
      where: {
        id: id,
      },
    });
    if (gatewayFound) {
      throw new ResponseError(401, "Gateway is exists");
    }

    const roomFound = await prismaClient.room.findUnique({
      where: {
        id: room_id,
      },
    });
    if (!roomFound) {
      throw new ResponseError(401, "Room not found");
    }

    const newGateway = await prismaClient.iotGateway.create({
      data: {
        id: id,
        name: name,
        ip_address: ip_address,
        description: description,
        room: {
          connect: {
            id: roomFound.id,
          },
        },
      },
    });

    return {
      id: newGateway.id,
      name: newGateway.name,
      location: `${roomFound.name} ${roomFound.number} - ${roomFound.type}`,
      ip_address: newGateway.ip_address,
      description: newGateway.description,
    };
  } catch (error) {
    throw error;
  }
};

export const getIotGatewaysService = async (page, limit, skip, query) => {
  try {
    const searchCondition = query
      ? {
          OR: [
            {
              id: {
                contains: query,
              },
            },
            {
              name: {
                contains: query,
              },
            },
            {
              description: {
                contains: query,
              },
            },
            {
              ip_address: {
                contains: query,
              },
            },
            {
              room: {
                name: {
                  contains: query,
                },
              },
            },
            {
              room: {
                number: {
                  contains: query,
                },
              },
            },
            {
              room: {
                type: {
                  contains: query,
                },
              },
            },
          ],
        }
      : {};

    const whereCondition = {
      ...searchCondition,
    };

    const total = await prismaClient.iotGateway.count({
      where: whereCondition,
    });
    const total_page = Math.ceil(total / limit);
    const iotGateways = await prismaClient.iotGateway.findMany({
      where: whereCondition,
      skip: skip,
      take: limit,
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        description: true,
        room: {
          select: {
            name: true,
            number: true,
            type: true,
          },
        },
        ip_address: true,
        status: true,
        device_connected: {
          select: {
            id: true,
            mac_address: true,
          },
        },
        uptime: true,
        firmware: true,
      },
    });

    const onlineCount = await prismaClient.iotGateway.count({
      where: {
        status: true,
      },
    });
    const offlineCount = await prismaClient.iotGateway.count({
      where: {
        status: false,
      },
    });

    const dataIotGateways = iotGateways.map((i) => {
      const location = i.room
        ? `${i.room.name} ${i.room.number} - ${i.room.type}`
        : "-";
      const deviceCount = i.device_connected.length;

      return {
        id: i.id,
        name: i.name,
        description: i.description,
        location: location,
        network: i.ip_address,
        status: i.status,
        device_count: deviceCount,
        uptime: i.uptime,
        firmware: i.firmware,
      };
    });

    return {
      current_page: page,
      total_items: total,
      total_page: total_page,
      online_count: onlineCount,
      offline_count: offlineCount,
      data: dataIotGateways,
    };
  } catch (error) {
    throw error;
  }
};

function waitForFirmawareVersion(responseTopic, timeoutMs = 5000) {
  return new Promise((resolve) => {
    let timeout;

    const handler = (topic, message) => {
      if (topic === responseTopic) {
        const data = JSON.parse(message.toString());
        clearTimeout(timeout);
        mqttClient.removeListener("message", handler);
        resolve(data.firmware_version);
      }
    };

    mqttClient.on("message", handler);
    mqttClient.subscribe(responseTopic);

    timeout = setTimeout(() => {
      mqttClient.removeListener("message", handler);
      resolve(null);
    }, timeoutMs);
  });
}
