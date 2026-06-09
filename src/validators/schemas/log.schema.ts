import {
	BaseFilterQuerySchema,
	logActionSchema,
	objectIdSchema,
} from "@common/schemas";
import z from "zod";

export const LogCreateSchema = z.object({
	admin: objectIdSchema,
	action: logActionSchema,
	resource: z.string().trim().min(1, "resource is required"),
	ip: z.string().trim().nullable().optional(),
	platform: z.string().trim().nullable().optional(),
	agent: z.string().trim().nullable().optional(),
});

export const LogGetAllSchema = BaseFilterQuerySchema.extend({
	type: z.enum(["user", "audit"]),
	role: z
		.string()
		.regex(/^[0-9a-fA-F]{24}$/)
		.optional(),
});

export const LogDeleteSchema = z
	.object({
		type: z.enum(["audit", "user"], {
			message: "Type is expected to be 'audit', or 'user'",
		}),
	})
	.strict();

export type LogCreateInput = z.infer<typeof LogCreateSchema>;
export type LogGetAllInput = z.infer<typeof LogGetAllSchema>;
export type LogDeleteInput = z.infer<typeof LogDeleteSchema>;
