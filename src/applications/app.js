import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import mqtt from "mqtt";
import { publicRouter } from "../routes/public-api.js";

// ==== Konfigurasi ====
const port = process.env.PORT || 3000;
const allowedOrigins = ["http://localhost:5173"];
const mqttClient = mqtt.connect("mqtt://broker.emqx.io:1883");

// ==== Inisialisasi ====
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
app.use(express.json());
app.use(cors({ origin: allowedOrigins }));
app.use(publicRouter);

export { app, server, io, port, mqttClient };
