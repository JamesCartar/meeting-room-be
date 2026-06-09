import {
	type HydratedDocument,
	type InferSchemaType,
	model,
	Schema,
} from "mongoose";

const RoleSchema = new Schema(
	{
		name: { type: String, required: true, unique: true, trim: true },
		description: { type: String, trim: true, default: null },
		type: { type: String, enum: ["system", "custom"], default: "custom" },
	},
	{ timestamps: true },
);

export type RoleDocument = HydratedDocument<InferSchemaType<typeof RoleSchema>>;
export type RoleSchemaType = InferSchemaType<typeof RoleSchema>;

const Role = model<RoleSchemaType>("role", RoleSchema);

export default Role;
