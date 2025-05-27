import express from "express";
import { authMiddleware } from "../middleware/auth-middleware.js";
import userController from "../controllers/user-controller.js";
import patientController from "../controllers/patient-controller.js";
import { prismaClient } from "../applications/database.js";

const privateRouter = new express.Router();
privateRouter.use(authMiddleware);

// User
privateRouter.get("/api/user-current", userController.currentUser);
privateRouter.post("/api/user-logout", userController.logout);

// Patient
privateRouter.post("/api/patients", patientController.create);

// Show barcode patient
privateRouter.get(
  "/api/patients/:id/barcode",
  patientController.showBarcodeTest
);

export { privateRouter };
