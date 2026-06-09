import type { Pagination } from "@common/schemas";
import Admin, {
	type AdminDocument,
	type AdminSchemaType,
} from "@db/models/admin.model";
import type {
	AdminCreateInput,
	AdminUpdateInput,
} from "@validators/schemas/admin.schema";
import { Types, type ClientSession, type QueryFilter } from "mongoose";

const castAdminAggregateFilters = (
	filters: QueryFilter<AdminSchemaType>,
): QueryFilter<AdminSchemaType> => {
	const castedFilters = { ...filters };

	if (typeof castedFilters.role === "string") {
		castedFilters.role = new Types.ObjectId(castedFilters.role);
	}

	if (Array.isArray(castedFilters.$and)) {
		castedFilters.$and = castedFilters.$and.map((condition) =>
			castAdminAggregateFilters(condition as QueryFilter<AdminSchemaType>),
		);
	}

	return castedFilters;
};

class AdminRepository {
	async create(data: AdminCreateInput) {
		const admin = await Admin.create(data); 
		return admin;
	}
	async getAll(filters: QueryFilter<AdminSchemaType>, pagination: Pagination) {
		const admins = await Admin.aggregate([
			{ $match: castAdminAggregateFilters(filters) },
			{ $sort: { createdAt: -1 } },
			{ $skip: pagination.limit * pagination.page },
			{ $limit: pagination.limit },
			{
				$lookup: {
					from: "roles",
					localField: "role",
					foreignField: "_id",
					as: "role",
				},
			},
			{ $unwind: "$role" },
			{
				$lookup: {
					from: "bookings",
					let: { adminId: "$_id" },
					pipeline: [
						{ $match: { $expr: { $eq: ["$user", "$$adminId"] } } },
						{ $count: "count" },
					],
					as: "bookingCountResult",
				},
			},
			{
				$set: {
					bookingCount: {
						$ifNull: [{ $first: "$bookingCountResult.count" }, 0],
					},
				},
			},
			{
				$project: {
					password: 0,
					__v: 0,
					updatedAt: 0,
					bookingCountResult: 0,
					"role.description": 0,
					"role.type": 0,
					"role.createdAt": 0,
					"role.updatedAt": 0,
					"role.__v": 0,
				},
			},
		]);

		return admins;
	}
	async getNames() {
		const users = await Admin.find(
			{},
			{
				_id: 1,
				name: 1,
			},
		)
			.sort({ name: "ascending" })
			.lean();

		return users;
	}
	async getCount(filters: QueryFilter<AdminSchemaType>) {
		const count = await Admin.countDocuments(filters);
		return count;
	}
	async getById(id: string, fieldToExclude: Record<string, number> = {}) {
		const admin = await Admin.findById(id, {
			...fieldToExclude,
			__v: 0,
			updatedAt: 0,
		})
			.populate({
				path: "role",
				select: "_id name",
			})
			.lean();
		return admin;
	}
	async getByEmail(email: string) {
		const admin = await Admin.findOne({ email }, { __v: 0, updatedAt: 0, })
			.populate({ path: "role", select: "_id name" })
			.lean();
		return admin;
	}
	async getOneAndUpdate(
		filter: object,
		data: AdminUpdateInput,
		session: ClientSession,
	) {
		const admin = await Admin.findOneAndUpdate(filter, data, { session });
		return admin;
	}
	async updatePassword(_id: string, password: string) {
		return await Admin.updateOne({ _id }, { password });
	}
	async updatePasswordByEmail(email: string, password: string) {
		return await Admin.updateOne({ email }, { password });
	}
	async save(admin: AdminDocument, session: ClientSession) {
		await admin.save({ session });
		return;
	}
	async getOneAndDelete(filter: object, session: ClientSession) {
		const admin = await Admin.findOneAndDelete(filter, { session });
		return admin;
	}
}

export default AdminRepository;
