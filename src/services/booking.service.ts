import { assertDefined } from "@helpers/assertDefined.helper";
import { BadRequestError, NotFoundError } from "@helpers/errors";
import { generatePagination } from "@helpers/generatePagination.helper";
import type BookingRepository from "@repositories/booking.repository";
import { assertCanAccess } from "@utils/abac.util";
import { buildBookingFilter } from "@utils/filters/booking.filter";
import type { BookingGetAllInput } from "@validators/schemas/booking.schema";
import type { Request } from "express";
import type { ClientSession } from "mongoose";

const getBookingUser = (user: unknown) => {
	if (typeof user === "object" && user && "_id" in user) {
		return String((user as { _id: unknown })._id);
	}

	return String(user);
};

class BookingService {
	constructor(private readonly bookingRepository: BookingRepository) {}

	async create(req: Request) {
		const actor = assertDefined(
			req.actor,
			new BadRequestError("Authentication actor is missing"),
		);

		assertCanAccess(actor, "booking:create");

		const hasOverlap = await this.bookingRepository.existsOverlapping(
			req.body.startTime,
			req.body.endTime,
		);

		if (hasOverlap) {
			throw new BadRequestError(
				"Booking overlaps with an existing booking. Back-to-back bookings are allowed.",
			);
		}

		const booking = await this.bookingRepository.create({
			...req.body,
			user: actor.id,
		});

		return { _id: booking._id.toString() };
	}

	async getAll(req: Request) {
		const filterQuery = req.validatedQuery as BookingGetAllInput;
		const filters = buildBookingFilter(filterQuery);
		const paginationInput = assertDefined(
			req.pagination,
			new BadRequestError("Pagination data is missing"),
		);

		const bookings = await this.bookingRepository.getAll(filters, paginationInput);
		const totalCount = await this.bookingRepository.getCount(filters);
		const pagination = generatePagination(
			bookings.length,
			totalCount,
			paginationInput,
		);

		return {
			bookings,
			pagination,
			timeAssumption:
				"All booking times are stored as UTC Date values. API inputs must include timezone offsets.",
		};
	}

	async getSingle(req: Request) {
		const { id } = req.params;

		const booking = await this.bookingRepository.getById(id);
		if (!booking) throw new NotFoundError();

		return { booking };
	}

	async delete(req: Request, session: ClientSession) {
		const { id } = req.params;
		const actor = assertDefined(
			req.actor,
			new BadRequestError("Authentication actor is missing"),
		);

		const existingBooking = await this.bookingRepository.getById(id);
		if (!existingBooking) throw new NotFoundError();

		assertCanAccess(actor, "booking:delete", {
			user: getBookingUser(existingBooking.user),
		});

		const booking = await this.bookingRepository.getOneAndDelete(
			{ _id: id },
			session,
		);
		if (!booking) throw new NotFoundError();

		return { _id: booking._id.toString() };
	}

	async getGroupedByUser(req: Request) {
		assertCanAccess(req.actor, "booking:summary");

		const groups = await this.bookingRepository.getGroupedByUser();
		return { groups };
	}

	async getUsageSummary(req: Request) {
		assertCanAccess(req.actor, "booking:summary");

		const summary = await this.bookingRepository.getUsageSummary();
		return { summary };
	}
}

export default BookingService;
