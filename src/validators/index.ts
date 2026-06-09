import type { RequestHandler } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import type { z } from "zod";

type AnyZodSchema = z.ZodTypeAny;

export const validateHeaders = <TSchema extends AnyZodSchema>(
	schema: TSchema,
): RequestHandler => {
	return async (req, _res, next) => {
		const result = await schema.safeParseAsync(req.headers);

		if (!result.success) {
			return next(result.error);
		}

		Object.assign(req.headers, result.data);

		return next();
	};
};

export const validateBody = <TSchema extends AnyZodSchema>(
	schema: TSchema,
): RequestHandler => {
	return async (req, _res, next) => {
		const result = await schema.safeParseAsync(req.body);

		if (!result.success) {
			return next(result.error);
		}

		req.body = result.data;
		return next();
	};
};

export const validateQuery = <TSchema extends AnyZodSchema>(
	schema: TSchema,
): RequestHandler => {
	return async (req, _res, next) => {
		const result = await schema.safeParseAsync(req.query);

		if (!result.success) {
			return next(result.error);
		}

		req.validatedQuery = result.data;
		return next();
	};
};

export const validateParams = <TSchema extends AnyZodSchema>(
	schema: TSchema,
): RequestHandler => {
	return async (req, _res, next) => {
		const result = await schema.safeParseAsync(req.params);

		if (!result.success) {
			return next(result.error);
		}

		req.params = result.data as unknown as ParamsDictionary;
		return next();
	};
};
