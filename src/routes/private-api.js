import express from "express";
import { authMiddleware } from "../middleware/auth-middleware.js";
import userController from "../controllers/user-controller.js";

const privateRouter = new express.Router();
privateRouter.use(authMiddleware);

// User
privateRouter.get("/api/user-current", userController.currentUser);
privateRouter.post("/api/user-logout", userController.logout);

export { privateRouter };
