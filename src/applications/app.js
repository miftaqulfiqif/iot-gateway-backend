import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import mqtt from "mqtt";
import { publicRouter } from "../routes/public-api.js";
import { privateRouter } from "../routes/private-api.js";
import { errorMiddleware } from "../middleware/error-middleware.js";
import cookieParser from "cookie-parser";

// ==== Config ====
const port = process.env.PORT || 3000;
const allowedOrigins = [
  "http://localhost:5173",
  "http://192.168.1.39:5173",
  "http://192.168.15.234:5173",
  "http://192.168.13.156:5173",
  "http://192.168.13.189:5173",
  "http://192.168.8.180:5173",
];
const mqttClient = mqtt.connect("mqtt://192.168.13.156:1883", {
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
});

// ==== Initialization ====
const app = express();
const server = http.createServer(app);

mqttClient.on("connect", () => {
  console.log("Connected to MQTT broker");
});

mqttClient.on("error", (err) => {
  console.error("MQTT connection error:", err);
});

// ==== WebSocket (Socket.IO) ====
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Authorization", "Content-Type"],
  },
});

// ==== Middleware ====
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(publicRouter);
app.use(privateRouter);
app.use(errorMiddleware);

export { app, server, io, port, mqttClient };
