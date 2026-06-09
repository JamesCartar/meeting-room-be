import { env } from "@config/env.config";
import type { TokenPayload } from "@customTypes/request";
import jwt from "jsonwebtoken";

const jwt_secret = env.JWT_SECRET;
const jwt_expiration_time = env.JWT_EXPIRATION_TIME;

export const generateToken = (payload: TokenPayload) => {
	const token = jwt.sign(payload, jwt_secret, {
		expiresIn: jwt_expiration_time,
	});
	return {
		token,
		expiresIn: jwt_expiration_time,
	};
};

export const verifyToken = (token: string): TokenPayload | string => {
	return jwt.verify(token, jwt_secret) as TokenPayload;
};
