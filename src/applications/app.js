import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

const port = 3000;

const app = express();
const server = http.createServer(app);

const allowedOrigin = ["http://localhost:5173"];

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Authorization", "Content-Type"],
  },
});

app.use(express.json());
app.use(cors());

export { app, server, io, port };
