import { HttpError } from "./http.error";

export class TooManyRequestsError extends HttpError {
	constructor(
		message: string = "Too many requests, please try again later.",
		bodyStatus: number = 429,
		status: number = 429,
		name: string = "Too Many Request Error",
	) {
		super(status, message, bodyStatus);
		this.name = name;
	}
}
