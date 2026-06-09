import { validateParamId } from "@common/validators/id.validator";
import { validatePagination } from "@common/validators/pagination.validator";
import AdminController from "@controllers/admin.controller";
import { requireAccess } from "@middlewares/abac.middleware";
import {
	controllerAsyncHandler,
	controllerAsyncHandlerWithTx,
} from "@middlewares/handlers/controllerAsync.handler";  
import AdminRepository from "@repositories/admin.repository";
import BookingRepository from "@repositories/booking.repository";
import AdminService from "@services/admin.service";
import { validateBody, validateQuery } from "@validators/index";
import {
	AdminCreateSchema,
	AdminGetAllSchema,
	AdminPasswordUpdateSchema,
	AdminUpdateSchema,
} from "@validators/schemas/admin.schema";
import { Router } from "express";

const adminRepository = new AdminRepository();
const bookingRepository = new BookingRepository();
const adminService = new AdminService(adminRepository, bookingRepository);
const adminController = new AdminController(adminService);

const router = Router();

router
	.route("/")
	.post([
		requireAccess("user:create"),
		validateBody(AdminCreateSchema),
		controllerAsyncHandler((req, res) =>
			adminController.create(req, res),
		),
	])
	.get([
		requireAccess("user:read"),
		validateQuery(AdminGetAllSchema),
		validatePagination,
		controllerAsyncHandler((req, res) => adminController.getAll(req, res)),
	]);

router
	.route("/password")
	.patch([
		validateBody(AdminPasswordUpdateSchema),
		controllerAsyncHandler((req, res) =>
			adminController.updatePassword(req, res),
		),
	]);

router
	.route("/me")
	.get([
		controllerAsyncHandler((req, res) => adminController.getMe(req, res)),
	]);

router
	.route("/names")
	.get([
		requireAccess("user:read"),
		controllerAsyncHandler((req, res) => adminController.getNames(req, res)),
	]);

router
	.route("/:id")
	.get([
		requireAccess("user:read"),
		validateParamId("id"),
		controllerAsyncHandler((req, res) => adminController.getSingle(req, res)),
	])
	.patch([
		requireAccess("user:update-role"),
		validateParamId("id"),
		validateBody(AdminUpdateSchema),
		controllerAsyncHandlerWithTx((req, res, session) =>
			adminController.update(req, res, session),
		),
	])
	.delete([
		requireAccess("user:delete"),
		validateParamId("id"),
		controllerAsyncHandlerWithTx((req, res, session) =>
			adminController.delete(req, res, session),
		),
	]);

export default router;
