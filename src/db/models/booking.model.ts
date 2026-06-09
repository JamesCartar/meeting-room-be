import {
	type HydratedDocument,
	type InferSchemaType,
	model,
	Schema,
} from "mongoose";

const BookingSchema = new Schema(
	{
		user: { type: Schema.Types.ObjectId, ref: "admin", required: true },
		startTime: { type: Date, required: true },
		endTime: { type: Date, required: true },
	},
	{ timestamps: true },
);

BookingSchema.index({ startTime: 1, endTime: 1 });
BookingSchema.index({ user: 1, createdAt: -1 });

export type BookingDocument = HydratedDocument<
	InferSchemaType<typeof BookingSchema>
>;
export type BookingSchemaType = InferSchemaType<typeof BookingSchema>;

const Booking = model<BookingSchemaType>("booking", BookingSchema);

export default Booking;
