import type { BookingSchemaType } from "@db/models/booking.model";
import type { BookingGetAllInput } from "@validators/schemas/booking.schema";
import type { QueryFilter } from "mongoose";

export const buildBookingFilter = (
	query: BookingGetAllInput,
): QueryFilter<BookingSchemaType> => {
	const filters: QueryFilter<BookingSchemaType> = {};

	if (query.user) filters.user = query.user;

	if (query.startFrom || query.startTo) {
		filters.startTime = {
			...(query.startFrom && { $gte: query.startFrom }),
			...(query.startTo && { $lte: query.startTo }),
		};
	}

	if (query.createdAfter || query.createdBefore) {
		filters.createdAt = {
			...(query.createdAfter && { $gte: query.createdAfter }),
			...(query.createdBefore && { $lte: query.createdBefore }),
		};
	}

	return filters;
};
