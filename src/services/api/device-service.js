import { mqttClient } from "../../applications/app.js";
import { prismaClient } from "../../applications/database.js";
import { ResponseError } from "../../errors/response-error.js";
import deviceController from "../../controllers/device-controller.js";

export const connectDeviceBluetooth = async (data) => {
  const { gateway_id, mac_address, model, device_function } = data;

  try {
    // return getParameters(device.device_function).map((p) => ({ parameter: p }));

    const gatewayDevice = await prismaClient.iotGateway.findUnique({
      where: {
        id: gateway_id,
      },
    });

    if (!gatewayDevice) {
      throw new ResponseError(401, "Gateway device not found");
    }

    // Check if mac address device exist
    const macAddressDeviceFound = await prismaClient.deviceConnected.findFirst({
      where: {
        mac_address: mac_address,
        gateway_id: gateway_id,
      },
    });
    if (macAddressDeviceFound) {
      throw new ResponseError(400, "Mac address device already exist");
    }

    // Check if name is null
    if (data.name === null || data.name === undefined || data.name === "") {
      data.name = model;
    }

    const deviceConnecting = await prismaClient.deviceConnected.create({
      data: {
        ...data,
        is_connected: true,
        parameters: {
          create: getParameters(device_function).map((p) => ({
            parameter: p,
          })),
        },
      },
    });

    //Emit MQTT
    mqttClient.publish(
      `iotgateway/${gateway_id}/bluetooth/add_device`,
      JSON.stringify({
        mac: mac_address,
        device_function: device_function,
      }),
      (err) => {
        if (err) {
          console.log("❌ MQTT publish error:", err);
        } else {
          console.log(
            `✅ MQTT message published to iotgateway/{id-unik}/tcpip/add_device : ${JSON.stringify(
              {
                mac: mac_address,
                device_function: device_function,
              },
            )}`,
          );
        }
      },
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
    `iotgateway/${device.gateway_id}/tcpip/add_device`,
    JSON.stringify({
      ip: device.ip_address,
      device_function: device.device_function,
    }),
    (err) => {
      if (err) {
        console.log("❌ MQTT publish error:", err);
      } else {
        console.log(
          `✅ MQTT message published to iotgateway/${device.gateway_id}/tcpip/add_device : ${JSON.stringify(
            {
              ip: device.ip_address,
              device_function: device.device_function,
            },
          )}`,
        );
      }
    },
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

export const disconnectDevice = async (device, gatewaySn) => {
  if (device.connection === "bluetooth") {
    await new Promise((resolve, reject) => {
      mqttClient.publish(
        `iotgateway/${gatewaySn}/bluetooth/remove_device`,
        JSON.stringify({
          mac: device.mac_address,
        }),
        (err) => {
          if (err) {
            console.error("❌ MQTT publish error:", err);
            return reject(
              new ResponseError(502, "Failed to send MQTT command"),
            );
          }
          resolve();
        },
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
              new ResponseError(502, "Failed to send MQTT command"),
            );
          }
          resolve();
        },
      );
    });
  }
};

export const deleteDeviceService = async (deviceId, gatewaySn) => {
  try {
    const deviceFound = await prismaClient.deviceConnected.findUnique({
      where: { id: deviceId },
    });
    if (!deviceFound) {
      throw new ResponseError(401, "Device not found");
    }
    // Disconnect device
    disconnectDevice(deviceFound, gatewaySn);

    return await prismaClient.deviceConnected.delete({
      where: { id: deviceId },
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
      },
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
      },
    );
  });

  // Delete Database
  const removedDevice = await prismaClient.deviceConnected.delete({
    where: { id: device.id },
  });

  return removedDevice;
};

export const getDevices = async (gatewayId, params, isBaby, query) => {
  let paramsList = [];
  let gatewayList = [];

  // parsing & params validation
  if (params) {
    paramsList = params.split(",").map((p) => p.trim());

    const invalidParams = paramsList.filter(
      (p) => !Object.values(MeasurementParameter).includes(p),
    );

    if (invalidParams.length > 0) {
      return [];
    }
  }

  // parsing gateway
  if (gatewayId) {
    gatewayList = gatewayId.split(",").map((g) => g.trim());
  }

  // Query condition
  const whereClause = {};

  if (paramsList.length > 0) {
    whereClause.parameters = {
      some: { parameter: { in: paramsList } },
    };
  }

  if (gatewayList.length > 0) {
    whereClause.gateway_id = { in: gatewayList };
  }

  if (!isBaby) {
    whereClause.device_function = {
      notIn: ["digitpro_baby", "digitpro_ida"],
    };
  }

  const devices = await prismaClient.deviceConnected.findMany({
    where: whereClause,
    include: {
      parameters: {
        select: { parameter: true },
      },
      gateway: {
        select: { id: true, name: true },
      },
    },
    orderBy: { created_at: "desc" },
  });

  return devices;
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

export const getDevicePatientMonitoringService = async (
  query,
  device_function,
) => {
  try {
    const searchCondition = query
      ? {
          OR: [
            {
              name: {
                contains: query,
              },
            },
            {
              ip_address: {
                contains: query,
              },
            },
          ],
        }
      : {};

    const deviceFunctionCondition = device_function
      ? {
          device_function,
        }
      : {
          device_function: {
            in: ["pasien_monitor_9000", "diagnostic_station_001"],
          },
        };

    const whereCondition = {
      ...searchCondition,
      is_connected: true,
      ...deviceFunctionCondition,
    };

    const devices = await prismaClient.deviceConnected.findMany({
      where: whereCondition,
      select: {
        id: true,
        name: true,
        gateway_id: true,
        ip_address: true,
      },
    });

    return devices;
  } catch (error) {
    throw error;
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
      },
    );

    // Filter unique users
    const uniqueUsers = new Map();
    for (const userEntry of recentUsers) {
      const user = userEntry.user;
      if (!uniqueUsers.has(user.id)) {
        uniqueUsers.set(user.id, {
          id: user.id,
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
          id: patient.id,
          patient_name: patient.name,
          description: entry.description,
          recorded_at: entry.recorded_at,
        });
      }
    }

    // Last Measurement
    const lastMeasurement = await prismaClient.patientHandler.findFirst({
      where: {
        device_id: deviceId,
      },
      orderBy: {
        timestamp: "desc",
      },
      select: {
        timestamp: true,
      },
    });

    return {
      detail: device,
      recent_users: Array.from(uniqueUsers.values()).slice(0, 10),
      recent_patient_use: Array.from(uniquePatients.values()).slice(0, 10),
    };
  } catch (error) {
    throw error;
  }
};

export const getMeasurementParameterService = async () => {
  try {
    return MeasurementParameter;
  } catch (error) {
    throw error;
  }
};

// definisi parameter medis (mirip enum)
const MeasurementParameter = {
  BODY_WEIGHT: "BODY_WEIGHT",
  BODY_HEIGHT: "BODY_HEIGHT",
  BODY_TEMPERATURE: "BODY_TEMPERATURE",
  BLOOD_PRESSURE: "BLOOD_PRESSURE",
  HEART_RATE: "HEART_RATE",
  FETAL_HEART_RATE: "FETAL_HEART_RATE",
  BMI: "BMI",
  ECG: "ECG",
  PLETHYSMOGRAM: "PLETHYSMOGRAM",
  SPO2: "SPO2",
  RESPIRATORY_RATE: "RESPIRATORY_RATE",
  PULSE_RATE: "PULSE_RATE",
  PATIENT_RATE: "PATIENT_RATE",
  VITAL_SIGN_MONITOR: "VITAL_SIGN_MONITOR",
};

// mapping deviceFunction -> parameter
const DEVICE_PARAMETER_MAP = {
  digitpro_baby: [MeasurementParameter.BODY_WEIGHT],
  digitpro_ida: [MeasurementParameter.BODY_WEIGHT],
  ultrasonic_pocket_doppler: [MeasurementParameter.FETAL_HEART_RATE],
  digitpro_bmi: [MeasurementParameter.BMI, MeasurementParameter.BODY_WEIGHT],
  diagnostic_station_001: [
    MeasurementParameter.ECG,
    MeasurementParameter.PLETHYSMOGRAM,
    MeasurementParameter.VITAL_SIGN_MONITOR,
  ],
  mft01: [MeasurementParameter.BODY_TEMPERATURE],
  tensione: [MeasurementParameter.BLOOD_PRESSURE],
  pulse_oximeter: [
    MeasurementParameter.SPO2,
    MeasurementParameter.RESPIRATORY_RATE,
    MeasurementParameter.PULSE_RATE,
  ],
  height_gauge: [MeasurementParameter.BODY_HEIGHT],
};

// Konfersi string ke enum prism
function toPrismaParameter(params) {
  if (!MeasurementParameter[params]) {
    throw new Error(`Invalid parameter ${params}`);
  }
  return MeasurementParameter[params];
}

// helper function
function getParameters(deviceFunction) {
  return DEVICE_PARAMETER_MAP[deviceFunction] || [MeasurementParameter.OTHER];
}
