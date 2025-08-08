import express from "express";
import userController from "../controllers/user-controller.js";
import ecg1200gController from "../controllers/devices-model/ecg1200g-controller.js";
import addressController from "../controllers/address-controller.js";
import { uploadEcg } from "../services/api/devices-model/ecg-service.js";

const publicRouter = new express.Router();

// User
publicRouter.post("/api/users-login", userController.login);

// Ecg 1200 g
publicRouter.post(
  "/api/ecg1200g/upload",
  uploadEcg.single("file"),
  ecg1200gController.uploadEcg
);

// Address
publicRouter.get("/api/province", addressController.getProvinces); // Get provinces
publicRouter.get("/api/regency", addressController.getRegencies); // Get regencies
publicRouter.get("/api/district", addressController.getDistricts); // Get district
publicRouter.get("/api/village", addressController.getVillages); // Get village

publicRouter.get("/", (req, res) => res.send("RIVALDI GAY"));

export { publicRouter };
