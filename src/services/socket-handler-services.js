import { io } from "../applications/app.js";
import mqtt from "mqtt";

const mqttClient = mqtt.connect("mqtt://broker.emqx.io:1883");

mqttClient.on("connect", () => {
  console.log("✅ Connected to MQTT broker");
});

export function joinRoom(socket, userId) {
  socket.join(userId);
  console.log(`User ${userId} joined room`);
}

export function handleMessage(data) {
  console.log(`Received message from user ${data.user_id}:`, data.data.message);

  io.to(data.user_id).emit("message", data);

  const topic = "ble/start";
  const payload = "1";
  mqttClient.publish(topic, payload, (err) => {
    if (err) {
      console.log("Error publishing MQTT message:", err);
    } else {
      console.log("MQTT message published successfully");
    }
  });
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
