import { mqttClient } from "../../applications/app.js";
import { prismaClient } from "../../applications/database.js";
import { ResponseError } from "../../errors/response-error.js";

export const connectDeviceBluetooth = async (device) => {
  try {
    const gatewayDevice = await prismaClient.iotGateway.findUnique({
      where: {
        id: device.gateway_id,
      },
    });

    if (!gatewayDevice) {
      throw new ResponseError(401, "Gateway device not found");
    }

    // Check if mac address device exist
    const macAddressDeviceFound = await prismaClient.deviceConnected.findFirst({
      where: {
        mac_address: device.mac_address,
        gateway_id: device.gateway_id,
      },
    });
    if (macAddressDeviceFound) {
      throw new ResponseError(400, "Mac address device already exist");
    }

    // Check if name is null
    if (
      device.name === null ||
      device.name === undefined ||
      device.name === ""
    ) {
      device.name = device.model;
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
                mac: device.mac_address,
                device_function: device.device_function,
              }
            )}`
          );
        }
      }
    );

    return deviceConnecting;
  } catch (error) {
    throw error;
  }
};

export const connectDeviceTcpIP = async (device) => {
  // Check gateway device
  const gatewayDevice = await prismaClient.iotGateway.findUnique({
    where: {
      id: device.gateway_id,
    },
  });

  if (!gatewayDevice) {
    throw new ResponseError(401, "Gateway device not found");
  }

  // Check if ip address device exist
  const ipAddressDeviceFound = await prismaClient.deviceConnected.findFirst({
    where: {
      ip_address: device.ip_address,
      gateway_id: device.gateway_id,
    },
  });
  if (ipAddressDeviceFound) {
    throw new ResponseError(401, "Ip Address device already connected");
  }

  //Emit MQTT
  mqttClient.publish(
    "iotgateway/{id-unik}/tcpip/add_device",
    JSON.stringify({
      ip: device.ip_address,
      device_function: device.device_function,
    }),
    (err) => {
      if (err) {
        console.log("❌ MQTT publish error:", err);
      } else {
        console.log(
          `✅ MQTT message published to iotgateway/{id-unik}/tcpip/add_device : ${JSON.stringify(
            {
              ip: device.ip_address,
              device_function: device.device_function,
            }
          )}`
        );
      }
    }
  );

  // Check if name is null
  if (device.name === null || device.name === undefined || device.name === "") {
    device.name = device.model;
  }

  const deviceConnecting = await prismaClient.deviceConnected.create({
    data: {
      ...device,
      is_connected: true,
    },
  });

  return deviceConnecting;
};

export const connectDeviceUsbService = async (device) => {
  try {
    return await prismaClient.deviceConnected.create({
      data: {
        gateway_id: device.gateway_id,
        name: device.name ? device.name : device.model,
        model: device.model,
        device_function: device.device_function,
        connection: device.connection,
        is_connected: true,
      },
    });
  } catch (error) {
    throw error;
  }
};

const disconnectDevice = async (device) => {
  if (device.connection === "bluetooth") {
    await new Promise((resolve, reject) => {
      mqttClient.publish(
        `iotgateway/{id-unik}/bluetooth/remove_device`,
        JSON.stringify({
          mac: device.mac_address,
        }),
        (err) => {
          if (err) {
            console.error("❌ MQTT publish error:", err);
            return reject(
              new ResponseError(502, "Failed to send MQTT command")
            );
          }
          resolve();
        }
      );
    });
  } else if (deviceConnection === "tcpip") {
    await new Promise((resolve, reject) => {
      mqttClient.publish(
        `iotgateway/{id-unik}/tcpip/remove_device`,
        JSON.stringify({
          ip: device.ip_address,
          device_function: device.device_function,
        }),
        (err) => {
          if (err) {
            console.error("❌ MQTT publish error:", err);
            return reject(
              new ResponseError(502, "Failed to send MQTT command")
            );
          }
          resolve();
        }
      );
    });
  }
};

export const deleteDeviceService = async (deviceId) => {
  try {
    const deviceFound = await prismaClient.deviceConnected.findUnique({
      where: { id: deviceId },
    });
    if (!deviceFound) {
      throw new ResponseError(401, "Device not found");
    }
    // Disconnect device
    disconnectDevice(deviceFound);

    return await prismaClient.deviceConnected.update({
      where: { id: deviceId },
      data: {
        is_connected: false,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const disconnectDeviceBluetooth = async (macDevice) => {
  // Check if mac device exist
  const device = await prismaClient.deviceConnected.findUnique({
    where: { mac_address: macDevice },
  });

  if (!device) {
    throw new ResponseError(401, "Mac Device not found");
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
    where: { mac_address: macDevice },
  });

  return removedDevice;
};

export const disconnectDeviceTcpIP = async (ipDevice) => {
  // Check if mac device exist
  const device = await prismaClient.deviceConnected.findFirst({
    where: { ip_address: ipDevice },
  });

  if (!device) {
    throw new ResponseError(401, "Mac Device not found");
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
    where: { id: device.id },
  });

  return removedDevice;
};

export const getDevices = async (gatewayId) => {
  if (gatewayId) {
    return await prismaClient.deviceConnected.findMany({
      where: {
        gateway_id: gatewayId,
      },
    });
  }
  return await prismaClient.deviceConnected.findMany();
};

export const getDevicesConnectedService = async (gatewayId) => {
  // Get device connected
  if (gatewayId) {
    return await prismaClient.deviceConnected.findMany({
      where: {
        gateway_id: gatewayId,
        is_connected: true,
      },
    });
  } else {
    return await prismaClient.deviceConnected.findMany({
      where: {
        is_connected: true,
      },
    });
  }
};

export const getDetailService = async (deviceId) => {
  try {
    const device = await prismaClient.deviceConnected.findUnique({
      where: { id: deviceId },
    });

    if (!device) {
      throw new ResponseError(401, "Device not found");
    }

    // Get recent practitioner use
    const recentUsers = await prismaClient.patientHandler.findMany({
      where: {
        device_id: deviceId,
      },
      orderBy: {
        timestamp: "desc",
      },
      select: {
        id: true,
        timestamp: true,
        user: {
          select: {
            id: true,
            name: true,
            speciality: true,
          },
        },
      },
    });

    // Get measurement activity
    const measurementActivity = await prismaClient.measurementActivity.findMany(
      {
        where: {
          patient_handler: {
            device_id: deviceId,
          },
        },
        orderBy: {
          recorded_at: "desc",
        },
        select: {
          description: true,
          recorded_at: true,
          patient_handler: {
            select: {
              patient: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      }
    );

    // Filter unique users
    const uniqueUsers = new Map();
    for (const userEntry of recentUsers) {
      const user = userEntry.user;
      if (!uniqueUsers.has(user.id)) {
        uniqueUsers.set(user.id, {
          name: user.name,
          speciality: user.speciality,
          timestamp: userEntry.timestamp,
        });
      }
    }

    // Filter unique patients
    const uniquePatients = new Map();
    for (const entry of measurementActivity) {
      const patient = entry.patient_handler.patient;
      if (!uniquePatients.has(patient.id)) {
        uniquePatients.set(patient.id, {
          patient_name: patient.name,
          description: entry.description,
          recorded_at: entry.recorded_at,
        });
      }
    }

    return {
      detail: device,
      recent_users: Array.from(uniqueUsers.values()).slice(0, 10),
      recent_patient_use: Array.from(uniquePatients.values()).slice(0, 10),
    };
  } catch (error) {
    throw error;
  }
};
