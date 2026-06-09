import { ZodError, z } from "zod";

export const EnvSchema = z
	.object({
		ENVIRONMENT: z.enum(["development", "production"]).default("development"),
		PORT: z.coerce.number().int().positive().default(5000),
		MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
		JWT_SECRET: z.string().min(10, "JWT_SECRET must be at least 10 characters"),
		JWT_EXPIRATION_TIME: z.coerce.number().int().positive().default(3600),
		OTP_EXPIRATION_TIME: z.coerce.number().int().positive().default(300),
		PASSWORD_SALT_ROUNDS: z.coerce.number().int().positive().default(10),
		TRUSTED_ORIGINS: z.preprocess(
			(val) => {
				if (val === "*") return "*"; // for allowing all origin
				if (typeof val === "string") return val.split(",").map((s) => s.trim());
				return [];
			},
			z.union([
				z.literal("*"),
				z.array(z.string()).min(1, "At least one TRUSTED_ORIGINS is required"),
			]),
		),
		RATE_LIMIT_DURATION: z.coerce.number().int().positive().default(3),
		RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(20),
	})
	.loose();

export type Env = z.infer<typeof EnvSchema>;

let env: Env;
try {
	env = EnvSchema.parse(process.env);
} catch (error) {
	if (error instanceof ZodError) {
		let message = "❌ Invalid environment variables:\n";
		error.issues.forEach((issue) => {
			message += `  - ${issue.path[0]?.toString()}: ${issue.message}\n`;
		});
		const e = new Error(message);
		e.stack = "";
		throw e;
	} else {
		throw error;
	}
}

export { env };
