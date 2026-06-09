import z from "zod";

export const loginSchema = z.object({
	email: z.email({ message: "Invalid email format" }).trim(),
	password: z
		.string({ message: "Password must be a string" })
		.trim()
		.min(1, { message: "Password is required" }),
});
