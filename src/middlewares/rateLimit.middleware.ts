import { env } from "@config/env.config";
import { TooManyRequestsError } from "@helpers/errors";
import type { NextFunction, Request, Response } from "express";
import rateLimit from "express-rate-limit";

const duration = env.RATE_LIMIT_DURATION;
const reqLimit = env.RATE_LIMIT_MAX_REQUESTS;

export const rateLimiter = rateLimit({
	windowMs: duration * 1000,
	limit: reqLimit,
	standardHeaders: "draft-8",
	legacyHeaders: false,
	skip: (req) => req.method === "OPTIONS", // skip CORS pre-flights
	handler: (_req: Request, _res: Response, next: NextFunction) => {
		next(
			new TooManyRequestsError(
				`Too many requests. Please try again after ${duration} second.`,
			),
		);
	},
});
