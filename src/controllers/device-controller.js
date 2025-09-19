import {
  connectDeviceBluetooth,
  connectDeviceTcpIP,
  disconnectDeviceBluetooth,
  disconnectDeviceTcpIP,
  getDevices,
  getDevicesConnectedService,
  getDetailService,
  deleteDeviceService,
  connectDeviceUsbService,
  getDevicePatientMonitoringService,
} from "../services/api/device-service.js";
import { prismaClient } from "../applications/database.js";

const connectBluetooth = async (req, res, next) => {
  try {
    const deviceConnecting = await connectDeviceBluetooth(req.body);
    res
      .status(200)
      .json({ message: "Device connected", data: deviceConnecting });
  } catch (error) {
    next(error);
  }
};

const deleteDevice = async (req, res, next) => {
  try {
    const deviceDeleting = await deleteDeviceService(
      req.params.device_id,
      req.user.gateway_id,
    );
    res.status(200).json({ message: "Device deleted", data: deviceDeleting });
  } catch (error) {
    next(error);
  }
};

const connectTcpIP = async (req, res, next) => {
  try {
    const device = req.body;
    const deviceConnecting = await connectDeviceTcpIP(device);
    res
      .status(200)
      .json({ message: "Device connected", data: deviceConnecting });
  } catch (error) {
    next(error);
  }
};
const connectUsb = async (req, res, next) => {
  try {
    const result = await connectDeviceUsbService(req.body);
    res.status(200).json({ message: "Device connected", data: result });
  } catch (error) {
    next(error);
  }
};

const disconnectBluetooth = async (req, res, next) => {
  try {
    const deviceDisconnecting = await disconnectDeviceBluetooth(req.params.mac);
    res
      .status(200)
      .json({ message: "Device disconnected", data: deviceDisconnecting });
  } catch (error) {
    next(error);
  }
};
const disconnectTcpIP = async (req, res, next) => {
  try {
    const deviceDisconnecting = await disconnectDeviceTcpIP(
      req.params.ip_address,
    );
    res
      .status(200)
      .json({ message: "Device disconnected", data: deviceDisconnecting });
  } catch (error) {
    next(error);
  }
};
const get = async (req, res, next) => {
  try {
    const devices = await getDevices();
    res.status(200).json({ message: "Get device success", data: devices });
  } catch (error) {
    next(error);
  }
};

const getDevicesConnected = async (req, res, next) => {
  const gatewayId = req.query.gateway_id;

  try {
    const devices = await getDevicesConnectedService(gatewayId);
    res.status(200).json({ message: "Get device success", data: devices });
  } catch (error) {
    next(error);
  }
};

const getDetail = async (req, res, next) => {
  try {
    const deviceId = req.params.device_id;
    const result = await getDetailService(deviceId);
    res.status(200).json({ message: "Get device success", data: result });
  } catch (error) {
    next(error);
  }
};

const getPatientMonitoringDevice = async (req, res, next) => {
  const query = req.query.query || "";
  let device_function = req.query.device_function || "";

  try {
    if (device_function === "all") {
      device_function = "";
    }

    const result = await getDevicePatientMonitoringService(
      query,
      device_function,
    );
    res.status(200).json({ message: "Get device success", data: result });
  } catch (error) {
    next(error);
  }
};

export default {
  connectBluetooth,
  connectTcpIP,
  disconnectBluetooth,
  disconnectTcpIP,
  connectUsb,
  get,
  getDevicesConnected,
  getDetail,
  deleteDevice,
  getPatientMonitoringDevice,
};
