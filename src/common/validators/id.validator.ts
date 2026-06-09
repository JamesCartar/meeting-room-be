import type { NextFunction, Request, Response } from "express";
import { objectIdSchema } from "../schemas";

export const validateParamId = (paramKey: string) => {
	return (req: Request, _res: Response, next: NextFunction) => {
		const id = req.params[paramKey];

		const result = objectIdSchema.safeParse(id);
		if (!result.success) {
			next(result.error);
		} else {
			next();
		}
	};
};
