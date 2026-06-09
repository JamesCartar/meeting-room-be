import AuthController from "@controllers/auth.controller";
import { controllerAsyncHandler } from "@middlewares/handlers/controllerAsync.handler";
import AdminRepository from "@repositories/admin.repository";
import AuthService from "@services/auth.service";
import { validateBody } from "@validators/index";
import { loginSchema } from "@validators/schemas/auth.schema";
import { Router } from "express";

const adminRepository = new AdminRepository();
const authService = new AuthService(adminRepository);
const authController = new AuthController(authService);

const router = Router();

router.post(
	"/login",
	validateBody(loginSchema),
	controllerAsyncHandler((req, res) => authController.login(req, res)),
);

export default router;
