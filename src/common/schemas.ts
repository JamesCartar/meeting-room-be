import z from "zod";

export const objectIdSchema = z
	.string()
	.regex(/^[0-9a-fA-F]{24}$/, "Invalid objectId");

export const userStatusSchema = z.enum(["active", "suspend"], {
	error: "Invalid status, must be 'active' or 'suspend'",
});

export const roleTypeSchema = z.enum(["system", "custom"], {
	error: "Invalid type, must be 'system' or 'custom'",
});

export const logActionSchema = z.enum(
	["create", "read", "update", "delete", "login", "logout"],
	{
		error: "Invalid log action",
	},
);

export const PaginationSchema = z.object({
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

export const BaseFilterQuerySchema = z.object({
	search: z.string().min(1).max(100).optional(),
	createdBefore: z.iso
		.date()
		.optional()
		.transform((val) => (val ? new Date(val) : undefined)),
	createdAfter: z.iso
		.date()
		.optional()
		.transform((val) => (val ? new Date(val) : undefined)),
});

export type UserStatus = z.infer<typeof userStatusSchema>;
export type RoleType = z.infer<typeof roleTypeSchema>;
export type LogAction = z.infer<typeof logActionSchema>;

export type Pagination = z.infer<typeof PaginationSchema>;
