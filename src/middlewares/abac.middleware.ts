import { assertCanAccess, type AccessAction } from "@utils/abac.util";
import type { RequestHandler } from "express";

export const requireAccess = (action: AccessAction): RequestHandler => {
	return (req, _res, next) => {
		try {
			assertCanAccess(req.actor, action);
			next();
		} catch (error) {
			next(error);
		}
	};
};
