import type { Pagination } from "@common/schemas";
import Admin, {
	type AdminDocument,
	type AdminSchemaType,
} from "@db/models/admin.model";
import type {
	AdminCreateInput,
	AdminUpdateInput,
} from "@validators/schemas/admin.schema";
import type { ClientSession, QueryFilter } from "mongoose";

class AdminRepository {
	async create(data: AdminCreateInput) {
		const admin = await Admin.create(data); 
		return admin;
	}
	async getAll(filters: QueryFilter<AdminSchemaType>, pagination: Pagination) {
		const admins = await Admin.find(filters, {
			password: 0,
			__v: 0,
			updatedAt: 0,
		})
			.populate({
				path: "role",
				select: "_id name",
			})
			.sort({ createdAt: "descending" })
			.skip(pagination.limit * pagination.page)
			.limit(pagination.limit);

		return admins;
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
