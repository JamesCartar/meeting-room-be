import type { NextFunction, Request, Response } from "express";
import { z } from "zod";

const paginationSchema = z.object({
	page: z
		.string()
		.optional()
		.transform((val) => (val ? parseInt(val, 10) : 1))
		.refine((val) => val > 0, {
			message: "Page must be a positive integer",
		}),
	limit: z
		.string()
		.optional()
		.transform((val) => (val ? parseInt(val, 10) : 10))
		.refine((val) => val > 0, {
			message: "Limit must be a positive integer",
		}),
});

export const validatePagination = (
	req: Request,
	_res: Response,
	next: NextFunction,
): void => {
	const result = paginationSchema.safeParse(req.query);
	if (!result.success) {
		next(result.error);
	} else {
		req.pagination = {
			page: result.data.page - 1,
			limit: result.data.limit,
		};

		next();
	}
};
