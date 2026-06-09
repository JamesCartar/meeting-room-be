import { successResponse } from "@helpers/response.helper";
import type AuthService from "@services/auth.service";
import type { Request, Response } from "express";

class AuthController {
	constructor(private readonly authService: AuthService) {}

	async login(req: Request, res: Response) {
		const data = await this.authService.login(req);
		return successResponse(res, "Admin login successfully", data);
	}
}

export default AuthController;
