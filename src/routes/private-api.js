import express from "express";
import { authMiddleware } from "../middleware/auth-middleware.js";
import userController from "../controllers/user-controller.js";
import patientController from "../controllers/patient-controller.js";
import babyController from "../controllers/baby-controller.js";
import measurementHistoriesController from "../controllers/measurement-histories-controller.js";
import measurementHistoriesDigitProBabyController from "../controllers/devices-model/digit-pro-baby-controller.js";
import measurementHistoriesDigitProIdaController from "../controllers/devices-model/digit-pro-ida-controller.js";
import measurementHistoriesDigitProBmiController from "../controllers/devices-model/digit-pro-bmi-controller.js";
import measurementHistoriesDoppler from "../controllers/devices-model/doppler-controller.js";
import deviceController from "../controllers/device-controller.js";
import measurementActivityController from "../controllers/measurement-activity-controller.js";
import iotGatewayController from "../controllers/iot-gateway-controller.js";
import pm9000Controller from "../controllers/devices-model/pm-9000-controller.js";
import ds001Controller from "../controllers/devices-model/ds-001-controller.js";
import satusehatController from "../controllers/satusehat-controller.js";
import roomController from "../controllers/patient-room-controller.js";
import centralMonitorController from "../controllers/central-monitor-controller.js";

const privateRouter = new express.Router();
privateRouter.use(authMiddleware);

// User
privateRouter.post("/api/users", userController.create); // Register user
privateRouter.get("/api/user-current", userController.currentUser); // Get current user
privateRouter.post("/api/user-logout", userController.logout); // Logout
privateRouter.get("/api/users", userController.getAllUsers); // Get All Users
privateRouter.get("/api/user/detail/:user_id", userController.getDetailUser); // Get User By Username
privateRouter.patch("/api/user/change-gateway", userController.changeGateway); // Change gateway

// Patient
privateRouter.post("/api/patients", patientController.create); // Create
privateRouter.patch("/api/patient-update/:id", patientController.update); // Update
privateRouter.get("/api/patients", patientController.getPatientsByHospital); // Get patients by hospital
privateRouter.get("/api/patients-by-user", patientController.getPatientsByUser); // Get patients by user
privateRouter.get("/api/all-patients", patientController.getAll); // Get all
privateRouter.get("/api/patient/:id", patientController.get); // Get
privateRouter.get(
  "/api/patient/detail/:patient_id",
  patientController.getDetailPatient
); // Get

//Baby
privateRouter.get("/api/babies", babyController.getAll); // Get all
privateRouter.get(
  "/api/baby-by-patient-id/:patient_id",
  babyController.getByPatientId
); // Get by patient id
privateRouter.get(
  "/api/baby-by-nik-parent/:nik",
  babyController.getByNikParent
); // Get by NIK Parent
privateRouter.post("/api/babies", babyController.create); // Create

// Iot Gatewy
privateRouter.post(
  "/api/iot-gateways",
  iotGatewayController.createNewIotGateway
);
privateRouter.get("/api/iot-gateways", iotGatewayController.getIotGateways);

// Measurement Activity
privateRouter.post(
  "/api/measurement-activity",
  measurementActivityController.createNewMeasurementActivity
); // Create new measurement activity

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
  "/api/measurement-histories-digit-pro-baby/device/:mac_address",
  measurementHistoriesDigitProBabyController.getByDevice
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
); // Get All
privateRouter.get(
  "/api/measurement-histories-digit-pro-bmi/patient/:patient_id",
  measurementHistoriesDigitProBmiController.getByPatientId
); // Get By Patient ID
privateRouter.get(
  "/api/measurement-histories-digit-pro-bmi/device/:device_id",
  measurementHistoriesDigitProBmiController.getByDeviceId
); // Get By Device ID
privateRouter.get(
  "/api/measurement-histories-digit-pro-bmi/user/:user_id",
  measurementHistoriesDigitProBmiController.getByUserId
); // Get By User ID

// Measurement Histories Doppler
privateRouter.post(
  "/api/measurement-histories-doppler",
  measurementHistoriesDoppler.create
);
privateRouter.get(
  "/api/measurement-histories-doppler",
  measurementHistoriesDoppler.getAll
);
privateRouter.get(
  "/api/measurement-histories-doppler/patient/:patient_id",
  measurementHistoriesDoppler.getByPatientId
);
privateRouter.get(
  "/api/measurement-histories-doppler/device/:device_id",
  measurementHistoriesDoppler.getByDeviceId
);
privateRouter.get(
  "/api/measurement-histories-doppler/user/:user_id",
  measurementHistoriesDoppler.getByUserId
);

// Measurement PM 9000
privateRouter.post(
  "/api/measurement-histories-pm-9000",
  pm9000Controller.create
);

// Measurement DS 001
privateRouter.post("/api/measurement-histories-ds-001", ds001Controller.create);

// Device
privateRouter.post(
  "/api/devices/connect-bluetooth",
  deviceController.connectBluetooth
); // Connect device
privateRouter.post("/api/devices/connect-tcpip", deviceController.connectTcpIP); // Connect device tcp-ip
privateRouter.post("/api/devices/connect-usb", deviceController.connectUsb); // Connect device tcp-ip
privateRouter.get("/api/devices", deviceController.get); // Get all device
privateRouter.get(
  "/api/devices-connected",
  deviceController.getDevicesConnected
); // Get all device connected
privateRouter.get("/api/detail-device/:device_id", deviceController.getDetail); // Get all device connected
privateRouter.delete(
  "/api/devices/disconnect-ble/:mac",
  deviceController.disconnectBluetooth
); // Disconnect device
privateRouter.delete(
"/api/devices/disconnect-tcpip/:ip_address",
  deviceController.disconnectTcpIP
); // Disconnect device
privateRouter.delete(
  "/api/device/delete/:device_id",
  deviceController.deleteDevice
);
privateRouter.get("/api/device-connected/monitor", deviceController.getPatientMonitoringDevice) // Get Patient Monitor Device

// SATUSEHAT
privateRouter.get("/api/satusehat", satusehatController.get);
privateRouter.patch("/api/satusehat", satusehatController.update);

// ROOM
privateRouter.post("/api/rooms", roomController.createRoom);
privateRouter.get("/api/rooms", roomController.getRoom);
privateRouter.post("/api/beds", roomController.createBed);
privateRouter.get("/api/beds", roomController.getBed);
privateRouter.post("/api/add-patient-room", roomController.addPatientRoom);
privateRouter.get("/api/patient-rooms", roomController.getPatientRoom);
privateRouter.get("/api/patient-rooms/detail/:room_id", roomController.getDetailRoom);
privateRouter.get("/api/patient-room/patient/:patient_id", roomController.getRoomByPatientId)

// Central Monitor
privateRouter.post("/api/central-monitor", centralMonitorController.create);

export { privateRouter };
