import {
  connectDevice,
  disconnectDevice,
  getDevices,
} from "../services/api/device-service.js";

const connect = async (req, res, next) => {
  try {
    const device = req.body;
    const deviceConnecting = await connectDevice(device);
    res
      .status(200)
      .json({ message: "Device connected", data: deviceConnecting });
  } catch (error) {
    next(error);
  }
};
const disconnect = async (req, res, next) => {
  try {
    const mac = req.params.mac;
    console.log("mac", mac);
    const deviceDisconnecting = await disconnectDevice(mac);
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
    res.status(200).json({ data: devices });
  } catch (error) {
    next(error);
  }
};

export default { connect, disconnect, get };
