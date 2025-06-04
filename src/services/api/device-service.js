import { prismaClient } from "../../applications/database.js";
import { ResponseError } from "../../errors/response-error.js";

export const connectDevice = async (device) => {
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
