import express from "express";
import userController from "../controllers/user-controller.js";
import deviceController from "../controllers/device-controller.js";
import patientController from "../controllers/patient-controller.js";

const publicRouter = new express.Router();

// User
publicRouter.post("/api/users", userController.register);
publicRouter.post("/api/users-login", userController.login);

publicRouter.get("/", (req, res) => res.send("Hello World!"));
publicRouter.get("/api/devices", deviceController.get);
publicRouter.post("/api/devices/connect", deviceController.connect);
publicRouter.delete(
  "/api/devices/disconnect/:mac",
  deviceController.disconnect
);

//Patient
publicRouter.post("/api/patients", patientController.create);
publicRouter.get("/api/patients", patientController.getAll);
publicRouter.get("/api/patient/:id", patientController.get);

export { publicRouter };
