import { mqttClient } from "../../applications/app.js";
import { prismaClient } from "../../applications/database.js";
import { ResponseError } from "../../errors/response-error.js";
import { getSocketIO } from "../socket/socket-instance.js";
import SocketRouter from "../socket/socket-router.js";

export const connectDeviceBluetooth = async (device) => {
  // Check if mac device exist
  const macDeviceFound = await prismaClient.deviceConnected.findUnique({
    where: {
      id: device.id,
    },
  });
  if (macDeviceFound) {
    throw new ResponseError(400, "Mac device already connected");
  }

  // Check if code device exist
  const codeDeviceFound = await prismaClient.deviceConnected.findUnique({
    where: {
      id: device.id,
    },
  });
  if (codeDeviceFound) {
    throw new ResponseError(400, "Code device already connected");
  }

  const deviceConnecting = await prismaClient.deviceConnected.create({
    data: device,
  });

  //Emit MQTT
  mqttClient.publish(
    "iotgateway/{id-unik}/bluetooth/add_device",
    JSON.stringify({
      ip: device.id,
      device_function: device.device_function,
    }),
    (err) => {
      if (err) {
        console.log("❌ MQTT publish error:", err);
      } else {
        console.log(
          `✅ MQTT message published to iotgateway/{id-unik}/tcpip/add_device : ${JSON.stringify(
            {
              mac: device.id,
              device_function: device.device_function,
            }
          )}`
        );
      }
    }
  );

  return deviceConnecting;
};
export const connectDeviceTcpIP = async (device) => {
  // Check if mac device exist
  const macDeviceFound = await prismaClient.deviceConnected.findUnique({
    where: {
      id: device.id,
    },
  });
  if (macDeviceFound) {
    throw new ResponseError(400, "Mac device already connected");
  }

  // Check if code device exist
  const codeDeviceFound = await prismaClient.deviceConnected.findUnique({
    where: {
      id: device.id,
    },
  });
  if (codeDeviceFound) {
    throw new ResponseError(400, "Code device already connected");
  }

  //Emit MQTT
  mqttClient.publish(
    "iotgateway/{id-unik}/tcpip/add_device",
    JSON.stringify({
      ip: device.id,
      device_function: device.device_function,
    }),
    (err) => {
      if (err) {
        console.log("❌ MQTT publish error:", err);
      } else {
        console.log(
          `✅ MQTT message published to iotgateway/{id-unik}/tcpip/add_device : ${JSON.stringify(
            {
              ip: device.id,
              device_function: device.device_function,
            }
          )}`
        );
      }
    }
  );

  const deviceConnecting = await prismaClient.deviceConnected.create({
    data: device,
  });

  return deviceConnecting;
};
export const disconnectDevice = async (macDevice) => {
  // Check mac device is exist
  const macDeviceFound = await prismaClient.deviceConnected.findUnique({
    where: {
      mac: macDevice,
    },
  });
  if (!macDeviceFound) {
    throw new ResponseError(402, "Mac Device not found");
  }

  // Disconnecting device
  const deviceDisconnecting = await prismaClient.deviceConnected.delete({
    where: {
      mac: macDevice,
    },
  });
  return deviceDisconnecting;
};

export const getDevices = async () => {
  return await prismaClient.deviceConnected.findMany();
};
