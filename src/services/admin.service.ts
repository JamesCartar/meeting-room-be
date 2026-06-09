import { assertDefined } from "@helpers/assertDefined.helper";
import {
	BadRequestError,
	NotFoundError,
	UnauthenticatedError,
} from "@helpers/errors";
import { generatePagination } from "@helpers/generatePagination.helper";
import type AdminRepository from "@repositories/admin.repository";
import type BookingRepository from "@repositories/booking.repository";
import { buildAdminFilter } from "@utils/filters/admin.filter";
import { comparePassword } from "@utils/password.util";
import type { AdminGetAllInput } from "@validators/schemas/admin.schema";
import type { Request } from "express";
import type { ClientSession } from "mongoose";

class AdminService {
	constructor(
		private readonly adminRepository: AdminRepository,
		private readonly bookingRepository?: BookingRepository,
	) {}

	async create(req: Request) {
		const { body } = req;

		const admin = await this.adminRepository.create(body);
		if (!admin) throw new BadRequestError("Admin creation not successful");

		return { _id: admin._id.toString() };
	}
	async getAll(req: Request) {
		const filterQuery = req.validatedQuery as AdminGetAllInput;
		const filters = buildAdminFilter(filterQuery);
		const paginationInput = assertDefined(
			req.pagination,
			new BadRequestError("Pagination data is missing"),
		);

		const admins = await this.adminRepository.getAll(filters, paginationInput);
		const totalCount = await this.adminRepository.getCount(filters);

		const pagination = generatePagination(
			admins.length,
			totalCount,
			paginationInput,
		);
		const response = {
			admins,
			pagination,
		};
		return response;
	}
	async getNames() {
		const users = await this.adminRepository.getNames();
		return { users };
	}
	async getSingle(req: Request) {
		const { id } = req.params;

		const admin = await this.adminRepository.getById(id as string, {
			password: 0,
		});
		if (!admin) throw new NotFoundError();

		const response = { admin };
		return response;
	}
	async getMe(req: Request) {
		const { sub } = assertDefined(
			req.jwt,
			new BadRequestError("Authentication payload is missing"),
		);

		const admin = await this.adminRepository.getById(sub, {
			password: 0,
		});
		if (!admin) throw new NotFoundError();

		return { user: admin };
	}
	async update(req: Request, session: ClientSession) {
		const { id } = req.params;
		const { body, jwt } = req;

		if (body.password && jwt?.sub === id) {
			throw new UnauthenticatedError("Can't update your own password", 803);
		}

		const admin = await this.adminRepository.getOneAndUpdate(
			{ _id: id },
			body,
			session,
		);
		if (!admin) throw new NotFoundError();

		return { _id: admin._id.toString() };
	}
	async changePassword(req: Request) {
		const { sub } = assertDefined(
			req.jwt,
			new BadRequestError("Authentication payload is missing"),
		);
		const { oldPassword, newPassword } = req.body;

		const admin = await this.adminRepository.getById(sub);
		if (!admin) throw new NotFoundError();

		const passwordMatched = await comparePassword(oldPassword, admin.password);
		if (!passwordMatched)
			throw new UnauthenticatedError("Incorrect password", 801);

		const result = await this.adminRepository.updatePassword(sub, newPassword);
		if (!result.modifiedCount) throw new NotFoundError();

		return;
	}
	async delete(req: Request, session: ClientSession) {
		const { id } = req.params;

		if (this.bookingRepository) {
			await this.bookingRepository.deleteManyByUser(id, session);
		}

		const admin = await this.adminRepository.getOneAndDelete(
			{ _id: id },
			session,
		);
		if (!admin) throw new NotFoundError();

		return { _id: admin._id.toString() };
	}
}

export default AdminService;
