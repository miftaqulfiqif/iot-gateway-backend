import { prismaClient } from "../../applications/database.js";

const connectDevice = async (device) => {
  const deviceConnecting = await prismaClient.deviceConnected.create({
    data: device,
  });

  return deviceConnecting;
};
const disconnectDevice = async (mac) => {
  const deviceDisconnecting = await prismaClient.deviceConnected.delete({
    where: {
      mac: mac,
    },
  });
  return deviceDisconnecting;
};
const getDevices = async () => {
  return await prismaClient.deviceConnected.findMany();
};

export { connectDevice, disconnectDevice, getDevices };
