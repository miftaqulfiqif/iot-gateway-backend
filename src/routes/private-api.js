import express from "express";
import { authMiddleware } from "../middleware/auth-middleware.js";
import userController from "../controllers/user-controller.js";
import patientController from "../controllers/patient-controller.js";
import babyController from "../controllers/baby-controller.js";
import measurementHistoriesController from "../controllers/measurement-histories-controller.js";
import measurementHistoriesDigitProBabyController from "../controllers/digit-pro-baby-controller.js";
import measurementHistoriesDigitProIdaController from "../controllers/digit-pro-ida-controller.js";
import measurementHistoriesDigitProBmiController from "../controllers/digit-pro-bmi-controller.js";
import measurementHistoriesDoppler from "../controllers/doppler-controller.js";
import deviceController from "../controllers/device-controller.js";

const privateRouter = new express.Router();
privateRouter.use(authMiddleware);

// User
privateRouter.get("/api/user-current", userController.currentUser); // Get current user
privateRouter.post("/api/user-logout", userController.logout); // Logout

// Patient
privateRouter.post("/api/patients", patientController.create); // Create
privateRouter.patch("/api/patient-update/:id", patientController.update); // Update
privateRouter.get(
  "/api/patients-by-hospital",
  patientController.getPatientsByHospital
); // Get patients by hospital
privateRouter.get("/api/patients-by-user", patientController.getPatientsByUser); // Get patients by user
privateRouter.get("/api/patients", patientController.getAll); // Get all
privateRouter.get("/api/patient/:id", patientController.get); // Get

//Baby
privateRouter.get("/api/babies", babyController.getAll); // Get all
privateRouter.get("/api/baby/:patient_id", babyController.getByPatientId); // Get by patient id
privateRouter.post("/api/babies", babyController.create); // Create

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

// Measurement Histories Digit Pro Baby
privateRouter.post(
  "/api/measurement-histories-digit-pro-baby",
  measurementHistoriesDigitProBabyController.create
); // Create
privateRouter.get(
  "/api/measurement-histories-digit-pro-baby",
  measurementHistoriesDigitProBabyController.getAll
); // Get All
privateRouter.get(
  "/api/measurement-histories-digit-pro-baby/patient/:patient_id",
  measurementHistoriesDigitProBabyController.getByPatientId
); // Get by patient id
privateRouter.get(
  "/api/measurement-histories-digit-pro-baby/device/:device_id",
  measurementHistoriesDigitProBabyController.getByDeviceId
); // Get by device id
privateRouter.get(
  "/api/measurement-histories-digit-pro-baby/user/:user_id",
  measurementHistoriesDigitProBabyController.getByUserId
); // Get by user id

// Measuremetn Histories Digit Pro Ida
privateRouter.post(
  "/api/measurement-histories-digit-pro-ida",
  measurementHistoriesDigitProIdaController.create
); // Create
privateRouter.get(
  "/api/measurement-histories-digit-pro-ida",
  measurementHistoriesDigitProIdaController.getAll
); // Get All
privateRouter.get(
  "/api/measurement-histories-digit-pro-ida/patient/:patient_id",
  measurementHistoriesDigitProIdaController.getByPatientId
); // Get By Patient Id
privateRouter.get(
  "/api/measurement-histories-digit-pro-ida/device/:device_id",
  measurementHistoriesDigitProIdaController.getByDeviceId
); // Get By Device Id
privateRouter.get(
  "/api/measurement-histories-digit-pro-ida/user/:user_id",
  measurementHistoriesDigitProIdaController.getByUserId
); // Get By User Id

// Measuremetn Histories Digit Pro BMI
privateRouter.post(
    "/api/measurement-histories-digit-pro-bmi",
    measurementHistoriesDigitProBmiController.create
); // Create
privateRouter.get(
    "/api/measurement-histories-digit-pro-bmi",
    measurementHistoriesDigitProBmiController.getAll
)

// Measurement Histories Doppler
privateRouter.post("/api/measurement-histories-doppler", measurementHistoriesDoppler.create )
privateRouter.get("/api/measurement-histories-doppler", measurementHistoriesDoppler.getAll )

// Device
privateRouter.post(
  "/api/devices/connect-bluetooth",
  deviceController.connectBluetooth
); // Connect device
privateRouter.post("/api/devices/connect-tcpip", deviceController.connectTcpIP); // Connect device tcp-ip
privateRouter.get("/api/devices", deviceController.get); // Get all device connected
privateRouter.delete(
  "/api/devices/disconnect-ble/:mac",
  deviceController.disconnectBluetooth
); // Disconnect device
privateRouter.delete(
  "/api/devices/disconnect-tcpip/:ip",
  deviceController.disconnectTcpIP
); // Disconnect device

export { privateRouter };
