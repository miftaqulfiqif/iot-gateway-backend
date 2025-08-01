import express from "express";
import userController from "../controllers/user-controller.js";
import ecg1200gController from "../controllers/ecg1200g-controller.js";
import { uploadEcg } from "../services/api/ecg-service.js";

const publicRouter = new express.Router();

// User
publicRouter.post("/api/users-login", userController.login);

// Ecg 1200 g
publicRouter.post(
  "/api/ecg1200g/upload",
  uploadEcg.single("file"),
  ecg1200gController.uploadEcg
);

publicRouter.get("/", (req, res) => res.send("RIVALDI GAY"));

export { publicRouter };
