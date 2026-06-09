import { hashPassword } from "@utils/password.util";
import {
	type HydratedDocument,
	type InferSchemaType,
	model,
	Schema,
	type UpdateQuery,
} from "mongoose";

const AdminSchema = new Schema(
	{
		name: { type: String, required: true, unique: true },
		email: { type: String, unique: true, sparse: true },
		password: { type: String, required: true },
		role: { type: Schema.Types.ObjectId, ref: "role", required: true },
		status: {
			type: String,
			enum: ["active", "suspend"],
			default: "active",
		},
	},
	{ timestamps: true },
);

export type AdminDocument = HydratedDocument<
	InferSchemaType<typeof AdminSchema>
>;
export type AdminSchemaType = InferSchemaType<typeof AdminSchema>;

AdminSchema.pre("save", async function () {
	const admin = this as AdminDocument;
	if (admin.isModified("password")) {
		const hashedPassword = await hashPassword(admin.password);
		admin.password = hashedPassword;
	}
});

AdminSchema.pre(["findOneAndUpdate", "updateOne"], async function () {
	const update = this.getUpdate() as UpdateQuery<AdminDocument> | null;
	if (update?.password) {
		const hashedPassword = await hashPassword(update.password);
		update.password = hashedPassword;
	}
});

const Admin = model<AdminSchemaType>("admin", AdminSchema);

export default Admin;
