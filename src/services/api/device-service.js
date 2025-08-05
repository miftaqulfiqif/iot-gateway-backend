import { mqttClient } from "../../applications/app.js";
import { prismaClient } from "../../applications/database.js";
import { ResponseError } from "../../errors/response-error.js";
import { getSocketIO } from "../socket/socket-instance.js";
import SocketRouter from "../socket/socket-router.js";



export const connectDeviceBluetooth = async (device) => {
  if (device.name === null || device.name === undefined || device.name === "") {
    device.name = device.device;
  }

  // Check if mac device exist
  const macDeviceFound = await prismaClient.deviceConnected.findUnique({
    where: {
      mac_address: device.mac_address,
    },
  });
  if (macDeviceFound) {
    throw new ResponseError(401, "Mac device already connected");
  }

  const deviceConnecting = await prismaClient.deviceConnected.create({
    data: {
      ...device,
      is_connected: true,
    },
  });

  //Emit MQTT
  mqttClient.publish(
    "iotgateway/{id-unik}/bluetooth/add_device",
    JSON.stringify({
      mac: device.id,
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
  // Check if ip address device exist
  const ipAddressDeviceFound = await prismaClient.deviceConnected.findUnique({
    where: {
      ip_address: device.ip_address,
    },
  });
  if (ipAddressDeviceFound) {
    throw new ResponseError(401, "Ip Address device already connected");
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
    data: {
      ...device,
      is_connected: true,
    },
  });

  return deviceConnecting;
};
export const disconnectDeviceBluetooth = async (macDevice) => {
  // Check if mac device exist
  const device = await prismaClient.deviceConnected.findUnique({
    where: { id: macDevice },
  });

  if (!device) {
    throw new ResponseError(402, "Mac Device not found");
  }

  // Publish MQTT
  await new Promise((resolve, reject) => {
    mqttClient.publish(
      `iotgateway/{id-unik}/bluetooth/remove_device`,
      JSON.stringify({
        mac: device.id,
      }),
      (err) => {
        if (err) {
          console.error("❌ MQTT publish error:", err);
          return reject(new ResponseError(500, "Failed to send MQTT command"));
        }
        resolve();
      }
    );
  });

  // Delete Database
  const removedDevice = await prismaClient.deviceConnected.delete({
    where: { id: macDevice },
  });

  return removedDevice;
};

export const disconnectDeviceTcpIP = async (ipDevice) => {
  // Check if mac device exist
  const device = await prismaClient.deviceConnected.findUnique({
    where: { id: ipDevice },
  });

  if (!device) {
    throw new ResponseError(402, "Mac Device not found");
  }

  // Publish MQTT
  await new Promise((resolve, reject) => {
    mqttClient.publish(
      `iotgateway/{id-unik}/tcpip/remove_device`,
      JSON.stringify({
        ip: device.id,
        device_function: device.device_function,
      }),
      (err) => {
        if (err) {
          console.error("❌ MQTT publish error:", err);
          return reject(new ResponseError(500, "Failed to send MQTT command"));
        }
        resolve();
      }
    );
  });

  // Delete Database
  const removedDevice = await prismaClient.deviceConnected.delete({
    where: { id: ipDevice },
  });

  return removedDevice;
};

export const getDevices = async () => {
  return await prismaClient.deviceConnected.findMany();
};

export const getDetailService = async (deviceId) => {
 try {
   const device = await prismaClient.deviceConnected.findUnique({
     where: { id: deviceId },
   })

   return {
     detail: device,
   };
 }catch (error) {
   throw error;
 }
};
