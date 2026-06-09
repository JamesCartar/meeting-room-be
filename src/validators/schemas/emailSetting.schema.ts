import z from "zod";

export const EmailSettingUpdateSchema = z
	.object({
		host: z.string().trim().min(1, "Host is required"),
		port: z.coerce.number().int().min(1, "Port must be greater than 0"),
		secure: z.boolean().optional(),
		authUser: z.string().min(1, "Auth user is required"),
		authPass: z.string().min(1, "Auth password is required"),
		from: z.string().trim().min(1, "From is required"),
		email: z.email().min(1, "Email is required"),
	})
	.partial();

export const EmailSettingTestSchema = z
	.object({
		from: z.string().trim().min(1, "From is required"),
		email: z.email().min(1, "Email is required"),
		subject: z.string().min(1).max(255),
		body: z.string().min(1),
	})
	.strict();

export const EmailSettingConfigureSchema = EmailSettingUpdateSchema.omit({
	from: true,
	email: true,
}).strict();

export type EmailSettingUpdateInput = z.infer<typeof EmailSettingUpdateSchema>;
export type EmailSettingTestInput = z.infer<typeof EmailSettingTestSchema>;
export type EmailSettingConfigureInput = z.infer<
	typeof EmailSettingConfigureSchema
>;
