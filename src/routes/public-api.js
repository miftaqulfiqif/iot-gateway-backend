import express from "express";
import userController from "../controllers/user-controller.js";
import deviceController from "../controllers/device-controller.js";
import patientController from "../controllers/patient-controller.js";

const publicRouter = new express.Router();

// User
publicRouter.post("/api/users", userController.register);
publicRouter.post("/api/users-login", userController.login);

publicRouter.get("/", (req, res) => res.send("Hello World!"));


export { publicRouter };
