import {
  connectDeviceBluetooth,
  connectDeviceTcpIP,
  disconnectDeviceBluetooth,
  disconnectDeviceTcpIP,
  getDevices,
} from "../services/api/device-service.js";

const connectBluetooth = async (req, res, next) => {
  try {
    const device = req.body;
    const deviceConnecting = await connectDeviceBluetooth(device);
    res
      .status(200)
      .json({ message: "Device connected", data: deviceConnecting });
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
    const deviceDisconnecting = await disconnectDeviceTcpIP(req.params.ip);
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

export default {
  connectBluetooth,
  connectTcpIP,
  disconnectBluetooth,
  disconnectTcpIP,
  get,
};
