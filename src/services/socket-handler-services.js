import { io } from "../applications/app.js";

export function joinRoom(socket, userId) {
  socket.join(userId);
  console.log(`User ${userId} joined room`);
}

export function handleStart(data) {
  console.log(`Received start from user ${data.userId}:`, data);
  io.to(data.userId).emit("start", data);
}

export function handleStatus(data) {
  console.log(`Received status from user ${data.userId}:`, data);
  io.to(data.userId).emit("device_status", data);
}

export function handleScan(data) {
  console.log(`Received scan from user ${data.userId}:`, data);
  io.to(data.userId).emit("scan", data);
}

export function handleDeviceDiscovered(data) {
  console.log(`Devices discovered from user ${data.userId}:`, data);
  io.to(data.userId).emit("devices_discovered", data);
}

export function handleChooseDevice(data) {
  console.log(`Device chosen from user ${data.userId}:`, data);
  io.to(data.userId).emit("choose_device", data);
}

export function handleSensorData(data) {
  console.log(`Sensor data from user ${data.userId}:`, data);
  io.to(data.userId).emit("sensor_data", data);
}

export function handleDone(data) {
  console.log(`Done from user ${data.userId}:`, data);
  io.to(data.userId).emit("done", data);
}

export function handleDisconnect() {
  console.log(`User was disconnected`);
}
