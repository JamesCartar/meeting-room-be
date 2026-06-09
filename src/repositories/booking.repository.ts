import type { Pagination } from "@common/schemas";
import Booking, { type BookingSchemaType } from "@db/models/booking.model";
import type {
	BookingCreateInput,
	BookingUpdateInput,
} from "@validators/schemas/booking.schema";
import type { ClientSession, QueryFilter, Types } from "mongoose";

class BookingRepository {
	async create(data: BookingCreateInput & { user: string }) {
		const booking = await Booking.create(data);
		return booking;
	}

	async getAll(filters: QueryFilter<BookingSchemaType>, pagination: Pagination) {
		const bookings = await Booking.find(filters, { updatedAt: 0, __v: 0 })
			.populate({ path: "user", select: "_id name role" })
			.sort({ startTime: "ascending" })
			.skip(pagination.limit * pagination.page)
			.limit(pagination.limit)
			.lean();

		return bookings;
	}

	async getCount(filters: QueryFilter<BookingSchemaType>) {
		const count = await Booking.countDocuments(filters);
		return count;
	}

	async getById(id: string) {
		const booking = await Booking.findById(id, { updatedAt: 0, __v: 0 })
			.populate({ path: "user", select: "_id name role" })
			.lean();
		return booking;
	}

	async existsOverlapping(startTime: Date, endTime: Date, excludeId?: string) {
		const filter: QueryFilter<BookingSchemaType> = {
			startTime: { $lt: endTime },
			endTime: { $gt: startTime },
		};

		if (excludeId) filter._id = { $ne: excludeId };

		const booking = await Booking.exists(filter);
		return Boolean(booking);
	}

	async getOneAndUpdate(filter: object, data: BookingUpdateInput) {
		const booking = await Booking.findOneAndUpdate(filter, data);
		return booking;
	}

	async getOneAndDelete(filter: object, session?: ClientSession) {
		const booking = await Booking.findOneAndDelete(filter, { session });
		return booking;
	}

	async deleteManyByUser(user: string | Types.ObjectId, session: ClientSession) {
		const result = await Booking.deleteMany({ user }, { session });
		return result;
	}

	async getGroupedByUser() {
		return await Booking.aggregate([
			{
				$lookup: {
					from: "admins",
					localField: "user",
					foreignField: "_id",
					as: "user",
				},
			},
			{ $unwind: "$user" },
			{ $sort: { startTime: 1 } },
			{
				$group: {
					_id: "$user",
					user: { $first: { _id: "$user._id", name: "$user.name", role: "$user.role" } },
					bookings: {
						$push: {
							_id: "$_id",
							startTime: "$startTime",
							endTime: "$endTime",
							createdAt: "$createdAt",
						},
					},
				},
			},
			{ $sort: { "user.name": 1 } },
		]);
	}

	async getUsageSummary() {
		return await Booking.aggregate([
			{
				$group: {
					_id: "$user",
					totalBookings: { $sum: 1 },
					firstBookingStartTime: { $min: "$startTime" },
					lastBookingEndTime: { $max: "$endTime" },
				},
			},
			{
				$lookup: {
					from: "admins",
					localField: "_id",
					foreignField: "_id",
					as: "user",
				},
			},
			{ $unwind: "$user" },
			{
				$project: {
					_id: 0,
					user: { _id: "$user._id", name: "$user.name", role: "$user.role" },
					totalBookings: 1,
					firstBookingStartTime: 1,
					lastBookingEndTime: 1,
				},
			},
			{ $sort: { totalBookings: -1, "user.name": 1 } },
		]);
	}
}

export default BookingRepository;
