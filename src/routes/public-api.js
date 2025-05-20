import express from "express";
import deviceController from "../controllers/device-controller.js";
import patientController from "../controllers/patient-controller.js";

const publicRouter = new express.Router();

publicRouter.get("/", (req, res) => res.send("Hello World!"));
publicRouter.get("/api/devices", deviceController.get);
publicRouter.post("/api/devices/connect", deviceController.connect);
publicRouter.delete(
  "/api/devices/disconnect/:mac",
  deviceController.disconnect
);

//Patient
publicRouter.post("/api/patients", patientController.create);

export { publicRouter };
