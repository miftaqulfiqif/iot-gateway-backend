import * as HandleService from "../services/socket-handler-services.js";

class SocketHandler {
  handleConnection(socket) {
    console.log("a user connected");

    //Join to room
    socket.on("join", (userId) => HandleService.joinRoom(socket, userId));
    socket.on("message", (data) => HandleService.handleMessage(data));
    //Handle start app
    socket.on("start", (data) => HandleService.handleStart(data));
    //Handle any status device
    socket.on("device_status", (data) => HandleService.handleStatus(data));
    //handle scan devices
    socket.on("scan", (data) => HandleService.handleScan(data));
    //handle discovered devices
    socket.on("devices_discovered", (data) =>
      HandleService.handleDeviceDiscovered(data)
    );
    //handle choose device
    socket.on("choose_device", (data) =>
      HandleService.handleChooseDevice(data)
    );
    //handle sensor data
    socket.on("sensor_data", (data) => HandleService.handleSensorData(data));
    //handle done
    socket.on("done", (data) => HandleService.handleDone(data));
    //handle disconnect
    socket.on("disconnect", () => HandleService.handleDisconnect());
  }
}
export default SocketHandler;
