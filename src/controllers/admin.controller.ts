import { successResponse } from "@helpers/response.helper";
import type AdminService from "@services/admin.service";
import type { Request, Response } from "express";
import type { ClientSession } from "mongoose";

class AdminController {
	constructor(private readonly adminService: AdminService) {}

	async create(req: Request, res: Response) {
		const data = await this.adminService.create(req);
		return successResponse(res, "Admin created successfully", data, 201);
	}
	async getAll(req: Request, res: Response) {
		const data = await this.adminService.getAll(req);
		return successResponse(res, "Get admin list successfully", data);
	}
	async getNames(_req: Request, res: Response) {
		const data = await this.adminService.getNames();
		return successResponse(res, "Get user names successfully", data);
	}
	async getSingle(req: Request, res: Response) {
		const data = await this.adminService.getSingle(req);
		return successResponse(res, "Get admin data successfully", data);
	}
	async getMe(req: Request, res: Response) {
		const data = await this.adminService.getMe(req);
		return successResponse(res, "Get current user successfully", data);
	}
	async update(req: Request, res: Response, session: ClientSession) {
		const data = await this.adminService.update(req, session);
		return successResponse(res, "Admin updated successfully", data);
	}
	async updatePassword(req: Request, res: Response) {
		await this.adminService.changePassword(req);
		return successResponse(res, "Password changed successfully");
	}
	async delete(req: Request, res: Response, session: ClientSession) {
		const data = await this.adminService.delete(req, session);
		return successResponse(res, "Admin deleted successfully", data);
	}
}

export default AdminController;
