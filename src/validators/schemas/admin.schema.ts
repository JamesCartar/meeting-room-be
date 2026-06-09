import {
	BaseFilterQuerySchema,
	objectIdSchema,
	userStatusSchema,
} from "@common/schemas";
import z from "zod";

export const AdminCreateSchema = z.object({
	name: z.string().trim().min(1, "Name is required"),
	email: z
		.email("Invalid email")
		.nullish()
		.transform((value) => value ?? undefined),
	password: z
		.string("Password is required")
		.min(6, "Password must be at least 6 characters"),
	role: objectIdSchema,
	status: userStatusSchema.optional(),
});

export const AdminUpdateSchema = AdminCreateSchema.partial();

export const AdminPasswordUpdateSchema = z.object({
	oldPassword: z
		.string({ error: "oldPassword is required" })
		.min(6, "Old password must be at least 6 characters"),
	newPassword: z
		.string({ error: "newPassword is required" })
		.min(6, "New password must be at least 6 characters"),
});

export const AdminGetAllSchema = BaseFilterQuerySchema.extend({
	role: objectIdSchema.optional(),
	status: userStatusSchema.optional(),
});

export type AdminCreateInput = z.infer<typeof AdminCreateSchema>;
export type AdminUpdateInput = z.infer<typeof AdminUpdateSchema>;
export type AdminPasswordUpdateInput = z.infer<
	typeof AdminPasswordUpdateSchema
>;
export type AdminGetAllInput = z.infer<typeof AdminGetAllSchema>;
