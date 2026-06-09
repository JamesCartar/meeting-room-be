import { NotFoundError, UnauthenticatedError } from "@helpers/errors";
import type AdminRepository from "@repositories/admin.repository";
import { generateToken } from "@utils/jwt.util";
import { comparePassword } from "@utils/password.util";
import type { Request } from "express";

class AuthService {
	constructor(private readonly adminRepository: AdminRepository) {}

	async login(req: Request) {
		const { email, password } = req.body;
		const admin = await this.adminRepository.getByEmail(email);

		if (!admin) throw new NotFoundError();
		if (admin.status === "suspend")
			throw new UnauthenticatedError(
				"Your account is temporarily suspended",
				804,
			);

		if (!admin.role) throw new NotFoundError("Role not found");

		const passwordMatched = await comparePassword(password, admin.password);
		if (!passwordMatched)
			throw new UnauthenticatedError("Incorrect credentials", 801);

		const payload = {
			sub: admin._id.toString(),
			role: admin.role._id.toString(),
		};
		const jwt = generateToken(payload);

		const { password: _hashedPassword, ...adminWithoutPassword } = admin;

		const response = { admin: adminWithoutPassword, jwt };
		return response;
	}
}

export default AuthService;
