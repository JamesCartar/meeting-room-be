import { z } from "zod";

export const askOtpSchema = z.object({
	email: z.email({
		message: "Please enter a valid email address",
	}),
});

export const verifyOtpSchema = z.object({
	email: z.string({
		message: "Please enter a valid email address",
	}),
	otpCode: z
		.string({ message: "OTP code is expected to be string" })
		.length(6, "OTP code must be 6 digits"),
});

export const resetPasswordSchema = z.object({
	email: z.string({ message: "Please enter a valid email address" }),
	newPassword: z.string({ message: "New password is expected to be string" }),
});
