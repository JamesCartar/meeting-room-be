import { validateParamId } from "@common/validators/id.validator";
import { validatePagination } from "@common/validators/pagination.validator";
import BookingController from "@controllers/booking.controller";
import { requireAccess } from "@middlewares/abac.middleware";
import {
	controllerAsyncHandler,
	controllerAsyncHandlerWithTx,
} from "@middlewares/handlers/controllerAsync.handler";
import BookingRepository from "@repositories/booking.repository";
import BookingService from "@services/booking.service";
import { validateBody, validateQuery } from "@validators/index";
import {
	BookingCreateSchema,
	BookingGetAllSchema,
} from "@validators/schemas/booking.schema";
import { Router } from "express";

const bookingRepository = new BookingRepository();
const bookingService = new BookingService(bookingRepository);
const bookingController = new BookingController(bookingService);

const router = Router();

router
	.route("/")
	.post([
		requireAccess("booking:create"),
		validateBody(BookingCreateSchema),
		controllerAsyncHandler((req, res) => bookingController.create(req, res)),
	])
	.get([
		requireAccess("booking:read"),
		validateQuery(BookingGetAllSchema),
		validatePagination,
		controllerAsyncHandler((req, res) => bookingController.getAll(req, res)),
	]);

router.get(
	"/grouped-by-user",
	[
		requireAccess("booking:summary"),
		controllerAsyncHandler((req, res) =>
			bookingController.getGroupedByUser(req, res),
		),
	],
);

router.get(
	"/summary",
	[
		requireAccess("booking:summary"),
		controllerAsyncHandler((req, res) =>
			bookingController.getUsageSummary(req, res),
		),
	],
);

router.delete(
	"/:id",
	[
		validateParamId("id"),
		controllerAsyncHandlerWithTx((req, res, session) =>
			bookingController.delete(req, res, session),
		),
	],
);

router.get(
	"/:id",
	[
		requireAccess("booking:read"),
		validateParamId("id"),
		controllerAsyncHandler((req, res) => bookingController.getSingle(req, res)),
	],
);

export default router;
