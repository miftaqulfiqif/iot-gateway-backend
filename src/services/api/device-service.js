import { prismaClient } from "../../applications/database.js";

const connectDevice = async (device) => {
  const deviceConnecting = await prismaClient.device.create({
    data: device,
  });

  return deviceConnecting;
};
const disconnectDevice = async (mac) => {
  const deviceDisconnecting = await prismaClient.device.delete({
    where: {
      mac: mac,
    },
  });
  return deviceDisconnecting;
};
const getDevices = async () => {
  return await prismaClient.device.findMany();
};

export { connectDevice, disconnectDevice, getDevices };
