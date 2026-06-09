import { successResponse } from "@helpers/response.helper";
import type BookingService from "@services/booking.service";
import type { Request, Response } from "express";
import type { ClientSession } from "mongoose";

class BookingController {
	constructor(private readonly bookingService: BookingService) {}

	async create(req: Request, res: Response) {
		const data = await this.bookingService.create(req);
		return successResponse(res, "Booking created successfully", data, 201);
	}

	async getAll(req: Request, res: Response) {
		const data = await this.bookingService.getAll(req);
		return successResponse(res, "Get booking list successfully", data);
	}

	async getSingle(req: Request, res: Response) {
		const data = await this.bookingService.getSingle(req);
		return successResponse(res, "Get booking data successfully", data);
	}

	async delete(req: Request, res: Response, session: ClientSession) {
		const data = await this.bookingService.delete(req, session);
		return successResponse(res, "Booking deleted successfully", data);
	}
}

export default BookingController;
