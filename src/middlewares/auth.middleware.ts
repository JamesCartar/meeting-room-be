import Admin from "@db/models/admin.model";
import { UnauthenticatedError } from "@helpers/errors";
import { normalizeRoleName } from "@utils/abac.util";
import { verifyToken } from "@utils/jwt.util";
import type { RequestHandler } from "express";

export const authMiddleware: RequestHandler = async (req, _res, next) => {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader?.startsWith("Bearer "))
			throw new UnauthenticatedError("Invalid token", 802);

		const token = authHeader.split(" ")[1];
		const decoded = verifyToken(token);

		if (typeof decoded !== "string") {
			req.jwt = decoded;
			const admin = await Admin.findById(decoded.sub, { _id: 1, role: 1 })
				.populate({ path: "role", select: "name" })
				.lean();

			if (!admin?.role) {
				throw new UnauthenticatedError("No role associated with user", 802);
			}

			const role = admin.role as unknown as { name: string };
			req.actor = {
				id: admin._id.toString(),
				role: normalizeRoleName(role.name),
			};

			return next();
		} else {
			throw new UnauthenticatedError("Token expired", 802);
		}
	} catch (error) {
		next(error);
	}
};
