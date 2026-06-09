import z from "zod";

export const NotificationTemplateUpdateSchema = z
	.object({
		subject: z.string().trim().min(1, "subject is required"),
		template: z.string().min(1, "template user is required"),
	})
	.strict();

export type NotificationTemplateUpdateInput = z.infer<
	typeof NotificationTemplateUpdateSchema
>;
