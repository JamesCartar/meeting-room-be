import { BaseFilterQuerySchema } from "@common/schemas";
import z from "zod";

const dateTimeSchema = z.iso
	.datetime({ offset: true })
	.transform((value) => new Date(value));

export const BookingCreateSchema = z
	.object({
		startTime: dateTimeSchema,
		endTime: dateTimeSchema,
	})
	.refine((data) => data.startTime < data.endTime, {
		message: "startTime must be before endTime",
		path: ["endTime"],
	});

export const BookingUpdateSchema = BookingCreateSchema.partial().refine(
	(data) =>
		!data.startTime || !data.endTime || data.startTime < data.endTime,
	{
		message: "startTime must be before endTime",
		path: ["endTime"],
	},
);

export const BookingGetAllSchema = BaseFilterQuerySchema.extend({
	user: z
		.string()
		.regex(/^[0-9a-fA-F]{24}$/, "Invalid objectId")
		.optional(),
	startFrom: z.iso
		.datetime({ offset: true })
		.optional()
		.transform((value) => (value ? new Date(value) : undefined)),
	startTo: z.iso
		.datetime({ offset: true })
		.optional()
		.transform((value) => (value ? new Date(value) : undefined)),
});

export type BookingCreateInput = z.infer<typeof BookingCreateSchema>;
export type BookingUpdateInput = z.infer<typeof BookingUpdateSchema>;
export type BookingGetAllInput = z.infer<typeof BookingGetAllSchema>;
