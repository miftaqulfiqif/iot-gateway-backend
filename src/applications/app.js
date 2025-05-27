import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import mqtt from "mqtt";
import { publicRouter } from "../routes/public-api.js";
import { privateRouter } from "../routes/private-api.js";
import { errorMiddleware } from "../middleware/error-middleware.js";
import cookieParser from "cookie-parser";

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
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(cors({ origin: allowedOrigins }));
app.use(publicRouter);
app.use(privateRouter);
app.use(errorMiddleware);

export { app, server, io, port, mqttClient };
