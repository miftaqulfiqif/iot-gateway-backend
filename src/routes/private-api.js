import express from "express";
import { authMiddleware } from "../middleware/auth-middleware.js";
import userController from "../controllers/user-controller.js";
import patientController from "../controllers/patient-controller.js";
import measurementHistoriesController from "../controllers/measurement-histories-controller.js";
import deviceController from "../controllers/device-controller.js";

const privateRouter = new express.Router();
privateRouter.use(authMiddleware);

// User
privateRouter.get("/api/user-current", userController.currentUser); // Get current user
privateRouter.post("/api/user-logout", userController.logout); // Logout

// Patient
privateRouter.post("/api/patients", patientController.create); // Create
privateRouter.get(
  "/api/patients-by-hospital",
  patientController.getPatientsByHospital
); // Get patients by hospital

// Show barcode patient
privateRouter.get(
  "/api/patients/:id/barcode",
  patientController.showBarcodeTest
); // Show barcode patient

// Measurement Histories
privateRouter.post(
  "/api/measurement-histories",
  measurementHistoriesController.createMeasurementHistory
); // Create
privateRouter.get(
  "/api/measurement-histories",
  measurementHistoriesController.getMeasurementHistories
); // Get
privateRouter.get(
  "/api/measurement-histories/:id",
  measurementHistoriesController.getMeasurementHistoryByPatientId
); // Get by patient id
privateRouter.get(
  "/api/measurement-histories/device/:device",
  measurementHistoriesController.getMeasurementHistoryByDevice
); // Get by device
privateRouter.get(
  "/api/measurement-histories-user",
  measurementHistoriesController.getMeasurementHistoryByUser
); // Get by user

// Device
privateRouter.post("/api/devices/connect", deviceController.connect);
privateRouter.get("/api/devices", deviceController.get);
privateRouter.delete(
  "/api/devices/disconnect/:mac",
  deviceController.disconnect
);

export { privateRouter };
