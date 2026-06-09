import z from "zod";

const ErrorDetailSchema = z.object({
	field: z.string(),
	issue: z.string(),
});

const ErrorSchema = z.object({
	success: z.literal(false),
	status: z.literal(400),
	message: z.string(),
	details: z.array(ErrorDetailSchema).optional().nullable(),
});

export const NotFoundErrorSchema = ErrorSchema.extend({
	status: z.literal(404),
});

export const BadRequestErrorSchema = ErrorSchema.extend({
	status: z.literal(400),
});

export const TooManyRequestsErrorSchema = ErrorSchema.extend({
	status: z.literal(429),
});
